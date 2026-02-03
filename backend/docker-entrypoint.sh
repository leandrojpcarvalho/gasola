#!/bin/sh
set -e
set -x

echo "🚀 Iniciando script de entrada do Docker..."

echo "📦 Verificando pasta shared..."
if [ -d "/shared" ]; then
  cd /shared
  
  if [ ! -d "node_modules" ] || [ ! -d "build" ]; then
    echo "📦 Instalando dependências do shared..."
    npm install
    echo "🔨 Construindo shared..."
    npm run build
  else
    echo "✅ Shared já está instalado e construído"
  fi
else
  echo "⚠️  Pasta shared não encontrada"
fi

# Voltar para o diretório do backend
cd /app

# Sempre verificar se o backend tem node_modules
if [ ! -d "node_modules" ]; then
  echo "📦 Instalando dependências do backend..."
  npm install
else
  echo "✅ Dependências do backend já instaladas"
fi

echo "⏳ Aguardando banco de dados..."

until pg_isready \
  -h "$DB_HOST" \
  -p "$DB_PORT" \
  -U "$DB_USER"; do
  echo "🕒 Banco ainda não está pronto..."
  sleep 2
done

echo "✅ Banco disponível"

# Necessário para psql não pedir senha interativa
export PGPASSWORD="$DB_PASSWORD"

echo "📦 Verificando se o banco '$DB_DATABASE' existe..."

DB_EXISTS=$(psql \
  -h "$DB_HOST" \
  -U "$DB_USER" \
  -d postgres \
  -tAc "SELECT 1 FROM pg_database WHERE datname = '$DB_DATABASE'")

if [ "$DB_EXISTS" != "1" ]; then
  echo "📦 Criando banco '$DB_DATABASE'..."
  psql \
    -h "$DB_HOST" \
    -U "$DB_USER" \
    -d postgres \
    -c "CREATE DATABASE \"$DB_DATABASE\";"
else
  echo "✅ Banco '$DB_DATABASE' já existe"
fi

echo "📦 Verificando se o banco de testes existe..."

TEST_DB="${DB_DATABASE}_test"
TEST_DB_EXISTS=$(psql \
  -h "$DB_HOST" \
  -U "$DB_USER" \
  -d postgres \
  -tAc "SELECT 1 FROM pg_database WHERE datname = '$TEST_DB'")

if [ "$TEST_DB_EXISTS" != "1" ]; then
  echo "📦 Criando banco de testes '$TEST_DB'..."
  psql \
    -h "$DB_HOST" \
    -U "$DB_USER" \
    -d postgres \
    -c "CREATE DATABASE \"$TEST_DB\";"

  echo "📐 Rodando migrations no banco de testes..."
  DB_DATABASE="$TEST_DB" node ace migration:run
else
  echo "✅ Banco de testes '$TEST_DB' já existe"
fi

echo "📐 Rodando migrations..."
node ace migration:run

echo "🌱 Verificando se precisa rodar seed..."

# Verificar se a tabela temas existe e tem dados
SEED_CHECK=$(psql \
  -h "$DB_HOST" \
  -U "$DB_USER" \
  -d "$DB_DATABASE" \
  -tAc "SELECT COUNT(*) FROM temas" 2>/dev/null || echo "0")

if [ "$SEED_CHECK" = "0" ] || [ -z "$SEED_CHECK" ]; then
  echo "🌱 Banco vazio, rodando seed..."
  node ace db:seed
else
  echo "✅ Banco já possui $SEED_CHECK tema(s), seed ignorado"
fi

echo "▶️ Iniciando aplicação..."
exec "$@"
