const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log('I am ready!');
});

client.on('message', message => {
    console.log(message);
    console.log(message.mentions.members);
    if (message.content === 'ping') {
        message.channel.send('pong');
    }
});

// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN); //BOT_TOKEN is the Client Secret
