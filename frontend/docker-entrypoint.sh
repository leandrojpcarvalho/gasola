#!/bin/sh
set -e

echo "🚀 Iniciando script de entrada do Frontend..."

# Verificar e instalar dependências do shared
if [ -d "/shared" ]; then
  echo "📦 Verificando pasta shared..."
  cd /shared
  
  if [ ! -d "node_modules" ] || [ ! -d "build" ]; then
    echo "📦 Instalando dependências do shared..."
    npm install
    echo "🔨 Construindo shared..."
    npm run build
    
    # Forçar reinstalação do frontend para atualizar o link do shared
    REINSTALL_FRONTEND=true
  else
    echo "✅ Shared já está instalado e construído"
  fi
else
  echo "⚠️  Pasta shared não encontrada"
fi

# Voltar para o diretório do app
cd /app

# Verificar e instalar dependências do frontend
if [ ! -d "node_modules" ] || [ "$REINSTALL_FRONTEND" = "true" ]; then
  echo "📦 Instalando dependências do frontend..."
  npm install
else
  echo "✅ Dependências do frontend já instaladas"
fi

echo "✅ Iniciando servidor de desenvolvimento..."
exec npm run dev -- --host
