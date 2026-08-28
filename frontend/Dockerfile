FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 4200

# Se fuerza el host 0.0.0.0 para que Angular sea accesible desde fuera del contenedor
CMD ["npx", "ng", "serve", "--host", "0.0.0.0"]
