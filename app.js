const { Client, Intents } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { createAudioPlayer, createAudioResource, joinVoiceChannel } = require('@discordjs/voice');
const { YTSearcher } = require('ytsearcher');
const ytdl = require('@distube/ytdl-core');
require('dotenv').config();

const bot = new Client({ intents: 3276799 });
const myToken = process.env.TOKENDISCORD; // Reemplaza con tu token bot discord

const queue = new Map();
const voiceConnections = new Map();
const searcher = new YTSearcher(process.env.TOKENYOUTUBE); // Reemplaza con tu token youtube v3 api
const commands = [
    {
      name: 'play',
      description: 'Reproduce una canción en el canal de voz actual.',
      options: [
        {
          name: 'song',
          description: 'Nombre de la canción o URL de YouTube',
          type: 3,
          required: true
        }
      ]
    },
    {
      name: 'skip',
      description: 'Omite la canción actual y reproduce la siguiente en la cola.'
    },
    {
      name: 'stop',
      description: 'Detiene la reproducción actual y limpia la cola de reproducción.'
    },
    {
      name: 'help',
      description: 'Muestra la lista de comandos disponibles y sus descripciones.'
    }
];

const rest = new REST({ version: '9' }).setToken(myToken);

bot.once('ready', async () => {
  try {
    console.log('Empezando a registrar comandos...');

    await rest.put(
      Routes.applicationCommands(bot.user.id),
      { body: commands },
    );

    console.log('Comandos registrados correctamente!');
  } catch (error) {
    console.error('Error al registrar comandos:', error);
  }
});

bot.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options, guildId } = interaction;

  if (commandName === 'play') {
    const song = options.getString('song');
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      return interaction.reply('No estás en un canal de voz.');
    }

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator
    });

    voiceConnections.set(interaction.guild.id, connection);

    let songUrl = song;
    let songTitle = "";

    try {
      if (!ytdl.validateURL(songUrl)) {
        const query = song;
        const searchResult = await searcher.search(query);
        if (!searchResult || !searchResult.first) {
          return interaction.reply(`No se encontraron resultados para "${query}".`);
        }
        songUrl = searchResult.first.url;
        songTitle = searchResult.first.title;
      } else {
        const songInfo = await ytdl.getInfo(songUrl);
        songTitle = songInfo.videoDetails.title;
      }

      const songData = { url: songUrl, title: songTitle };

      if (!queue.has(interaction.guild.id)) {
        queue.set(interaction.guild.id, [songData]);
        playNextSong(interaction.guild.id, interaction);
        await interaction.reply(`Reproduciendo "${songTitle}".`);
  
      } else {
        queue.get(interaction.guild.id).push(songData);
        await interaction.reply(`Se añadió "${songTitle}" a la cola. Canciones en cola: ${queue.get(interaction.guild.id).length}`);
      }
    } catch (error) {
      console.error("Error al procesar la canción:", error);
      await interaction.reply("Ocurrió un error al procesar la canción.");
    }
  } else if (commandName === 'skip') {
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      return interaction.reply('No estás en un canal de voz.');
    }

    const serverQueue = queue.get(interaction.guild.id);
    if (!serverQueue || serverQueue.length === 0) {
      return interaction.reply('No hay canciones en la cola para saltar.');
    }

    await interaction.reply('Saltando la canción actual...');
    serverQueue.shift();
    playNextSong(interaction.guild.id, interaction);
  } else if (commandName === 'stop') {
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      return interaction.reply('No estás en un canal de voz.');
    }

    const serverQueue = queue.get(interaction.guild.id);
    if (!serverQueue || serverQueue.length === 0) {
      return interaction.reply('No estoy reproduciendo nada.');
    }

    queue.get(interaction.guild.id).length = 0;
    await interaction.reply('¡Detenido y limpiado la cola!');
    const connection = voiceConnections.get(interaction.guild.id);
    if (connection) {
      resetQueue(interaction.guild.id);
    }
  } else if (commandName === 'help') {
    let response = '**Lista de Comandos:**\n';
    for (const cmd of commands) {
      response += `**/${cmd.name}**: ${cmd.description}\n`;
    }
    await interaction.reply(response);
  }
});



async function playNextSong(guildId, message) {
  const connection = voiceConnections.get(guildId);
  if (!connection) {
    message.channel.send("No estoy conectado a un canal de voz.");
    return;
  }

  const serverQueue = queue.get(guildId);
  if (!serverQueue || serverQueue.length === 0) {
    message.channel.send("No hay más canciones en la cola.");
    await resetQueue(guildId);
    return;
  }

  const song = serverQueue[0];
  const streamOptions = {
    quality: "highestaudio",
    filter: "audioonly", 
    highWaterMark: 1 << 25, 
      headers: {
        'cookie': 'CgJHVBIEGgAgSg%3D%3D', // Inserta tus cookies aquí
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3', // Cambia el User-Agent para parecer una solicitud desde un navegador
      }
    
  };

  const stream = ytdl(song.url, streamOptions);
  const resource = createAudioResource(stream);

  const player = createAudioPlayer();

  player.on("stateChange", (oldState, newState) => {
    if (newState.status === "idle") {
    
      message.channel.send("¡Terminó la reproducción de: " + song.title);
      serverQueue.shift(); 

      
      if (serverQueue.length > 0) {
        playNextSong(guildId, message);
      } else {
       
        message.channel.send("No hay más canciones en la cola.");
        resetQueue(guildId);
      }
    }
  });

  connection.subscribe(player);
  player.play(resource);
}





async function resetQueue(guildId) {
  const connection = voiceConnections.get(guildId);
  if (connection) {
    connection.destroy();
    voiceConnections.delete(guildId);
  }
  queue.delete(guildId);
}

bot.login(myToken);
