const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log('I am ready!');
});

client.on('message', message => {
    if (message.mentions.has(client.user)) {
        // we only care about messages where the bot is mentioned
        console.log(message.content);
        msg = message.content.replace("@" + client.user.username + " ", "");
        console.log(msg);
        if (msg === 'ping') {
            message.channel.send('pong');
        }
    }
});

// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN); //BOT_TOKEN is the Client Secret
