const { Client, Intents } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { createAudioPlayer, createAudioResource, joinVoiceChannel } = require('@discordjs/voice');
const { YTSearcher } = require('ytsearcher');
const ytdl = require('@distube/ytdl-core');
require('dotenv').config();

const bot = new Client({ intents: 3276799 });
const myToken = process.env.TOKENDISCORD; // Reemplaza con tu token bot discord

const cookies = [
  {
    domain: ".youtube.com",
    expirationDate: 1734699047.425723,
    hostOnly: false,
    httpOnly: true,
    name: "VISITOR_PRIVACY_METADATA",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    storeId: null,
    value: "CgJJThIEGgAgFQ%3D%3D",
  },
  {
    domain: ".youtube.com",
    expirationDate: 1753843246.988344,
    hostOnly: false,
    httpOnly: true,
    name: "__Secure-3PSID",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    storeId: null,
    value:
      "g.a000lAiRYLcUFLl1n_vbSYs-s5uA379kVmZJxHYwq2PM-p07Goh3ktmeBHzicFxLrrY1jCdjlwACgYKARcSARYSFQHGX2MiNb2Mx4Pr-cG_Ivo65bMH5hoVAUF8yKp3jkY9Jv3ItdkQSld95BFt0076",
  },
  {
    domain: ".youtube.com",
    expirationDate: 1753099072.203414,
    hostOnly: false,
    httpOnly: false,
    name: "SIDCC",
    path: "/",
    sameSite: null,
    secure: false,
    session: false,
    storeId: null,
    value:
      "AKEyXzVeovZmi0iygdiNNgCZBGpCOtZ9R-fUcmrVSRPMrQU2WxrHSqKVxaWJFOVDStW-oPFsuPM",
  },
  {
    domain: ".youtube.com",
    expirationDate: 1753843246.988103,
    hostOnly: false,
    httpOnly: false,
    name: "SID",
    path: "/",
    sameSite: null,
    secure: false,
    session: false,
    storeId: null,
    value:
      "g.a000lAiRYLcUFLl1n_vbSYs-s5uA379kVmZJxHYwq2PM-p07Goh3y8nsdlb_JaqkHthkxMnbwAACgYKAQISARYSFQHGX2Mi2vUgMvRqJypXXNzjnbJ_uhoVAUF8yKqAbwAcc_-I0WocMh6heEHt0076",
  },
  {
    domain: ".youtube.com",
    expirationDate: 1753098906.306531,
    hostOnly: false,
    httpOnly: true,
    name: "__Secure-1PSIDTS",
    path: "/",
    sameSite: null,
    secure: true,
    session: false,
    storeId: null,
    value:
      "sidts-CjEB4E2dkcYM_plcHBj5Odp2bAiEbylHSnLtdOLcc6vgQOh1jAq9OSyOH6L_GLkJyW2TEAA",
  },
  {
    domain: ".youtube.com",
    expirationDate: 1753843246.987618,
    hostOnly: false,
    httpOnly: false,
    name: "SAPISID",
    path: "/",
    sameSite: null,
    secure: true,
    session: false,
    storeId: null,
    value: "M1Lxb6wlz_oBu8mO/Ao5xpgrvY1S8-KIsT",
  },
  {
    domain: ".youtube.com",
    expirationDate: 1753099072.203546,
    hostOnly: false,
    httpOnly: true,
    name: "__Secure-1PSIDCC",
    path: "/",
    sameSite: null,
    secure: true,
    session: false,
    storeId: null,
    value:
      "AKEyXzW0R3j84NqXUjz2h4f3X0UP4loVzBj3k_QBunt4U7TvPIqXw46303UA9MO4zDxporquGsM",
  },
  {
    domain: ".youtube.com",
    expirationDate: 1753843246.98744,
    hostOnly: false,
    httpOnly: true,
    name: "SSID",
    path: "/",
    sameSite: null,
    secure: true,
    session: false,
    storeId: null,
    value: "A84rc3yLtVTFVbKSW",
  },
  {
    domain: ".youtube.com",
    expirationDate: 1753119987,
    hostOnly: false,
    httpOnly: false,
    name: "wide",
    path: "/",
    sameSite: null,
    secure: false,
    session: false,
    storeId: null,
    value: "1",
  },
  {
    domain: ".youtube.com",
    expirationDate: 1753843246.987718,
    hostOnly: false,
    httpOnly: false,
    name: "__Secure-1PAPISID",
    path: "/",
    sameSite: null,
    secure: true,
    session: false,
    storeId: null,
    value: "M1Lxb6wlz_oBu8mO/Ao5xpgrvY1S8-KIsT",
  },
  {
    domain: ".youtube.com",
    expirationDate: 1753843246.988277,
    hostOnly: false,
    httpOnly: true,
    name: "__Secure-1PSID",
    path: "/",
    sameSite: null,
    secure: true,
    session: false,
    storeId: null,
    value:
      "g.a000lAiRYLcUFLl1n_vbSYs-s5uA379kVmZJxHYwq2PM-p07Goh3o_9JmjGGrq8lBBZf5b-c-gACgYKAb0SARYSFQHGX2MiF1ROLmavW09Vr6BkJXlqoRoVAUF8yKqpSu2LueIn6aQb-EdLT4qe0076",
  },
  {
    domain: ".youtube.com",
    expirationDate: 1753843246.987783,
    hostOnly: false,
    httpOnly: false,
    name: "__Secure-3PAPISID",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    storeId: null,
    value: "M1Lxb6wlz_oBu8mO/Ao5xpgrvY1S8-KIsT",
  },
  {
    domain: ".youtube.com",
    expirationDate: 1753099072.203611,
    hostOnly: false,
    httpOnly: true,
    name: "__Secure-3PSIDCC",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    storeId: null,
    value:
      "AKEyXzWHJRs7uh7lphIjlAP2rOlN6M829zbFctsMnvFRJZ19lqSGzcrV4_HWNFyK0WmHwHvdIc0",
  },
  {
    domain: ".youtube.com",
    expirationDate: 1753098906.306734,
    hostOnly: false,
    httpOnly: true,
    name: "__Secure-3PSIDTS",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    storeId: null,
    value:
      "sidts-CjEB4E2dkcYM_plcHBj5Odp2bAiEbylHSnLtdOLcc6vgQOh1jAq9OSyOH6L_GLkJyW2TEAA",
  },
  {
    domain: ".youtube.com",
    expirationDate: 1732181052.322853,
    hostOnly: false,
    httpOnly: false,
    name: "_ga",
    path: "/",
    sameSite: null,
    secure: false,
    session: false,
    storeId: null,
    value: "GA1.1.1790027701.1697620831",
  },
  {
    domain: ".youtube.com",
    expirationDate: 1732181052.342756,
    hostOnly: false,
    httpOnly: false,
    name: "_ga_VCGEPY40VB",
    path: "/",
    sameSite: null,
    secure: false,
    session: false,
    storeId: null,
    value: "GS1.1.1697620831.1.1.1697621052.0.0.0",
  },
  {
    domain: ".youtube.com",
    expirationDate: 1753843246.9875,
    hostOnly: false,
    httpOnly: false,
    name: "APISID",
    path: "/",
    sameSite: null,
    secure: false,
    session: false,
    storeId: null,
    value: "iiwZ67wEWBtL2law/A4ujmP22CU4hRC_KQ",
  },
  {
    domain: ".youtube.com",
    expirationDate: 1753843246.987296,
    hostOnly: false,
    httpOnly: true,
    name: "HSID",
    path: "/",
    sameSite: null,
    secure: false,
    session: false,
    storeId: null,
    value: "AMg8iawsbtS2k1mSN",
  },
  {
    domain: ".youtube.com",
    expirationDate: 1747373578.653288,
    hostOnly: false,
    httpOnly: true,
    name: "LOGIN_INFO",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    storeId: null,
    value:
      "AFmmF2swRQIhAN3FryU-BMwWaJTqVWkdvvR9vj8wi2-vzQapNCAPk5mWAiA0DuK68j5YHyrk179E7R2iNQo8mLKOevd2ziHZvybvYQ:QUQ3MjNmd1dkMW95TWpzek5Ga1pHMkJhREN3OVJsQlZjY2xRdEhHcE5jT1owQWF0UWU2OTQ5OHMzZGt4ZGc3dU1vcDUtcm5Rblducm85ZWlremtVSjF1b0RUSUtxbE5vUmdURVB3cG9oLXJack44MkZBQW5pSWNxRUNyaEh0dW5DNTNkenZuM3g1cjNzbk5MRkZuVVlOemVuSmhGeWJSVDh3",
  },
  {
    domain: ".youtube.com",
    expirationDate: 1756123075.024899,
    hostOnly: false,
    httpOnly: false,
    name: "PREF",
    path: "/",
    sameSite: null,
    secure: true,
    session: false,
    storeId: null,
    value:
      "f6=40000400&f7=4150&tz=Asia.Calcutta&f4=4000000&repeat=NONE&volume=27&autoplay=true",
  },
];

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
  };

  const agentOptions = {
    headers: {
      referer: "https://www.youtube.com/",
    },
  };
  
  const agent = ytdl.createAgent(cookies, agentOptions);


  const stream = ytdl(song.url,streamOptions, agent);
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
