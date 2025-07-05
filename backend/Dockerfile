# Usa una imagen oficial de Node.js
FROM node:18

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala las dependencias (incluye devDependencies para nodemon)
RUN npm install --include=dev

# Copia el resto del código de la app
COPY . .

# Expone el puerto que tu app usa
EXPOSE 3000

# Comando por defecto al iniciar el contenedor
CMD ["npm", "run", "dev"]
