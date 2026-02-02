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

# Mudar para o diretório do frontend
WORKDIR /app

# Copiar package.json do frontend
COPY frontend/package*.json ./

# Instalar dependências do frontend
RUN npm install

# Copiar código do frontend
COPY frontend/ ./

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
