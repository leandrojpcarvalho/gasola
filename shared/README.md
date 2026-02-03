# Pasta Shared

Esta pasta contém tipos e utilitários compartilhados entre o backend e o frontend.

## 🐳 Docker

O `shared` é buildado **automaticamente** dentro das imagens Docker do backend e frontend. Os arquivos `node_modules` e `dist` **não** são sincronizados com o host para evitar problemas de permissão.

### Como funciona?

1. O Dockerfile copia o código do `shared`
2. Instala as dependências e faz o build dentro da imagem
3. As aplicações usam o shared já compilado dentro do container

## 💻 Build Local (Desenvolvimento)

Se precisar buildar localmente (para testes ou desenvolvimento fora do Docker):

```bash
cd shared
./build-local.sh
```

Ou manualmente:

```bash
cd shared
npm install
npm run build
```

⚠️ **Importante**: Se você clonar o repositório, **não precisa** rodar nada na pasta `shared`. O Docker cuida de tudo!

## 🔧 Scripts Disponíveis

- `npm run build` - Compila o TypeScript
- `npm run watch` - Compila em modo watch
- `npm run clean` - Remove a pasta dist

## 📝 Arquivos no .gitignore

Os seguintes arquivos/pastas **não** são versionados:
- `node_modules/`
- `dist/`
- `tsconfig.tsbuildinfo`

Isso garante que cada desenvolvedor tenha um ambiente limpo ao clonar o repositório.
