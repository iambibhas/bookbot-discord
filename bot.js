const Discord = require('discord.js');
const fetch = require('node-fetch');
const XML2JSON = require('xml2json');
const client = new Discord.Client();
const gr_key = process.env.GOODREADS_KEY;

client.on('ready', () => {
    console.log('I am ready!');
});


function getMessage(topbook) {
    var rating = 0.0;
    if (typeof topbook.average_rating === 'object') {
        rating = topbook.average_rating['$t'];
    } else {
        rating = topbook.average_rating;
    }

    var description = '';
    if (typeof topbook.description !== 'object') {
        description = topbook.description;
    }

    var publication_year = '';
    if (typeof topbook.publication_year === 'object') {
        publication_year = topbook.original_publication_year['$t'];
    } else {
        publication_year = topbook.publication_year;
    }

    if (description !== undefined) {
        description = description.replace(/\<br \/\>/g, "\n").replace(/<(?:.|\n)*?>/gm, '').substr(0, 1500) + "…";
    }

    var fullMessage = `**${topbook.best_book.title}** (${publication_year})
by *${topbook.best_book.author.name}* - ⭐️ ${rating}

${description}

Goodreads URL: https://www.goodreads.com/book/show/${topbook.best_book.id['$t']}`;
    return fullMessage;
}

client.on('message', message => {
    if (message.mentions.has(client.user)) {
        // we only care about messages where the bot is mentioned

        // strip all the mentions from the message
        msg = message.content.replace(/<@!\d+>/gimu, "").trim()

        if (msg !== '') {
            var topbook;
            var gr_url = "http://www.goodreads.com/search/index.xml?key=" + gr_key + "&q=" + encodeURIComponent(msg);

            fetch(gr_url)
                .then(res => res.text())
                .then(body => {
                    var json_response = JSON.parse(XML2JSON.toJson(body));

                    if (json_response.GoodreadsResponse.search.results == "") {
                        message.channel.send("No book found! :(")
                        return;
                    } else if (json_response.GoodreadsResponse.search.results.work[0] == undefined) {
                        topbook = json_response.GoodreadsResponse.search.results.work;
                    } else { /* More than one book received */
                        topbook = json_response.GoodreadsResponse.search.results.work[0];
                    }

                    if (topbook !== undefined) {
                        var gr_book_details_url = "https://www.goodreads.com/book/show/" + topbook.best_book.id['$t'] + ".xml?key=" + gr_key;
                        fetch(gr_book_details_url)
                            .then(res => res.text())
                            .then(body => {
                                var json_book_response = JSON.parse(XML2JSON.toJson(body));
                                topbook.description = json_book_response.GoodreadsResponse.book.description;
                                topbook.publication_year = json_book_response.GoodreadsResponse.book.publication_year;

                                // set cache
                                // redisclient.set(text.toLowerCase(), JSON.stringify(topbook));

                                var fullMessage = getMessage(topbook);
                                message.channel.send(fullMessage);
                                return;
                            });
                    }
                });
        }
    }
});

client.login(process.env.BOT_TOKEN);
