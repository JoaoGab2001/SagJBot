const { tokenbot } = require('./consts.json');

const { Client, RichEmbed } = require('discord.js');
var client = new Client();

client.on('ready', () => {
    console.log(`Help controller is ready!`);
});

client.on('message', message => {

    if (message.content == '!help' ) {

        var arrayPrint = String();

        // COMANDOS
        arrayPrint += "**!help** (Mostra essa mensagem) \n\n";
        arrayPrint += "**!matches** *nickname* (Mostra os ultimos jogos da conta inserida) \n * \*costuma demorar um pouco* \* \n\n";
        arrayPrint += "**!champions** *nickname* (Mostra os cinco melhor champions do player ordenado por pontos de maestria) \n";

        var embed = new RichEmbed()

        embed
        .setTitle(`>> Comandos do bot`)
        .setColor(0x00FF00)
        .setDescription(arrayPrint);

        message.channel.send(embed);
    }
});

client.login(tokenbot);
