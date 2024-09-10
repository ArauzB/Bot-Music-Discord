# Imagen base de Node.js
FROM node:20

# Instalar dependencias de Python 3.9, venv, ffmpeg y otras herramientas necesarias
RUN apt-get update && apt-get install -y \
    ffmpeg \
    git \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /usr/src/app

# Establecer directorio de trabajo para la app
WORKDIR /usr/src/app

# Copiar archivos de dependencias de Node.js
COPY package*.json ./

# Instalar dependencias de Node.js
RUN npm install

# Copiar el resto del código de la aplicación
COPY . .

# Comando para iniciar la aplicación
CMD ["npm", "start"]
