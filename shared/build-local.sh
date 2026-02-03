#!/bin/bash
# Script para buildar o shared localmente sem Docker

# Limpar arquivos antigos
rm -rf node_modules dist tsconfig.tsbuildinfo

# Instalar dependências
npm install

# Fazer o build
npm run build

echo "✅ Shared buildado com sucesso!"
