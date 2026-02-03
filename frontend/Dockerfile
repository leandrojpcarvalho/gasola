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

# Ajustar permissões do shared para o usuário node (que tem UID 1000)
RUN chown -R node:node /shared

# Mudar para o diretório do frontend
WORKDIR /app

# Copiar package.json do frontend
COPY frontend/package*.json ./

# Instalar dependências do frontend
RUN npm install

# Copiar código do frontend
COPY frontend/ ./

# Copiar script de entrypoint
COPY frontend/docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Ajustar permissões e mudar para usuário node
RUN chown -R node:node /app
USER node

EXPOSE 5173

ENTRYPOINT ["docker-entrypoint.sh"]
