const Discord = require('discord.js');
const fetch = require('node-fetch');
const XML2JSON = require('xml2json');
const client = new Discord.Client();
const gr_key = process.env.GOODREADS_KEY;

client.on('ready', () => {
    console.log('I am ready!');
});

client.on('message', message => {
    if (message.mentions.has(client.user)) {
        // we only care about messages where the bot is mentioned

        // strip all the mentions from the message
        msg = message.content.replace(/<@!\d+>/gimu, "").trim()

        if (msg !== '') {
            var gr_url = "http://www.goodreads.com/search/index.xml?key=" + gr_key + "&q=" + encodeURIComponent(msg);

            fetch(gr_url)
                .then(res => res.text())
                .then(body => {
                    console.log(body)
                    var json_response = JSON.parse(XML2JSON.toJson(body));
                    console.log(json_response);
                });
        }
    }
});

// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);
