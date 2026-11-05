FROM node:22-alpine
# Enlaza el paquete de GHCR con el repositorio y permite limpiar las imágenes de la app en el EC2
LABEL org.opencontainers.image.source=https://github.com/carljark/pai-app
LABEL app=pai-app
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Creamos la carpeta de uploads por si no existe
RUN mkdir -p uploads
EXPOSE 3000
CMD ["npm", "start"]
