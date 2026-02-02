FROM node:20.19-bullseye

# Criar diretório do shared
WORKDIR /shared

# Copiar package.json do shared
COPY shared/package*.json ./
COPY shared/tsconfig.json ./

# Instalar dependências do shared
RUN npm install

# Copiar código fonte do shared
COPY shared/ ./

# Construir o shared
RUN npm run build

# Mudar para o diretório do backend
WORKDIR /app

# Copiar package.json do backend
COPY backend/package*.json ./

# Instalar dependências do backend
RUN npm install

# Copiar código do backend
COPY backend/ ./

# Expor porta do servidor
EXPOSE 3333

# Health check
HEALTHCHECK --interval=10s --timeout=3s --start-period=30s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3333/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1); });"

# Comando para desenvolvimento com hot reload
CMD ["npm", "run", "dev"]
