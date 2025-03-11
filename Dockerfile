# Usar una imagen oficial de Node.js
FROM node:18

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos del proyecto
COPY package.json package-lock.json ./

# Instalar las dependencias
RUN npm install

# Copiar el código fuente al contenedor
COPY . .

# Exponer el puerto que usará la app dentro del contenedor
EXPOSE 4000

# Comando para ejecutar la aplicación
CMD ["node", "server.js"]
