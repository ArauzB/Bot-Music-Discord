# Discord Music Bot

Este es un bot de Discord diseñado para reproducir música en canales de voz utilizando la librería `discord.js` y `@discordjs/voice`.

## Requisitos
Node.js instalado en el sistema.

Las bibliotecas discord.js, @discordjs/rest, discord-api-types, @discordjs/voice, ytsearcher, y ytdl-core deben estar instaladas.

## Instalacion y Ejecucion

Clona el repositorio

```bash
  git clone https://github.com/ArauzB/Bot-Music-Discord.git
```

Ve al directorio del proyecto

```bash
  cd Bot-Music-Discord
```

Instalacion de dependencias

```bash
  npm install
```

Inicia el servidor

```bash
  npm run start
```

## Configuración

Obtén un token para tu bot Discord desde [Discord Developer Portal](https://discord.com/developers/applications).

Obtén una clave de API de YouTube v3 para ytsearcher desde [Google Developer Console](https://console.cloud.google.com/).

## Comandos Disponibles
- **/play:** Reproduce una canción en el canal de voz actual.

   - **Uso:** /play <nombre de la canción o URL de YouTube>

- **/skip:** Omite la canción actual y reproduce la siguiente en la cola.

- **/stop:** Detiene la reproducción actual y limpia la cola de reproducción.

- **/help:** Muestra la lista de comandos disponibles y sus descripciones.

## Personalización
Reemplaza `myToken` con tu token de bot Discord.

Reemplaza `searcherToken` con tu token de YouTube v3 API.

#

Este bot te permite reproducir música en canales de voz de Discord utilizando comandos interactivos. Asegúrate de configurar las claves de API necesarias y los tokens antes de ejecutar el bot.
