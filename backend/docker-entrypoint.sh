#!/bin/sh
set -e
set -x

echo "🚀 Iniciando script de entrada do Docker..."

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

echo "📐 Rodando migrations..."
node ace migration:run

echo "🌱 Verificando se precisa rodar seed..."

SEED_CHECK=$(node ace db:query "SELECT COUNT(*) as count FROM temas" \
  | grep -o '[0-9]\+' \
  | head -n 1)

if [ "$SEED_CHECK" = "0" ]; then
  echo "🌱 Banco vazio, rodando seed..."
  node ace db:seed
else
  echo "✅ Banco já possui dados, seed ignorado"
fi

echo "▶️ Iniciando aplicação..."
exec "$@"
