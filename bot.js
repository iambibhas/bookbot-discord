const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log('I am ready!');
});

client.on('message', message => {
    if (message.mentions.has(client.user)) {
        message.channel.send("I was mentioned!");
    } else {
        message.channel.send("I was not mentioned");
    }
    if (message.content === 'ping') {
        message.channel.send('pong');
    }
});

// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN); //BOT_TOKEN is the Client Secret
