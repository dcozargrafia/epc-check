FROM node:18-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm install --production

# Copiar TODO el código (incluyendo public/)
COPY . .

# Exponer puerto
EXPOSE 4000

# Comando de inicio
CMD ["node", "server.js"]
