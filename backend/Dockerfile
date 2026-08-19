FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Creamos la carpeta de uploads por si no existe
RUN mkdir -p uploads
EXPOSE 3000
CMD ["npx", "tsx", "src/server.ts"]
