const { tokenapiriot, tokenbot } = require('./consts.json');

const request = require('request');
const champions = require('./champions-pt_BR-9.21.1.json');

const { Client, RichEmbed } = require('discord.js');
var client = new Client();

client.on('ready', () => {
    console.log(`Champions controller is ready!`);
});

var headers = {
    "X-Riot-Token": tokenapiriot
}

client.on('message', async message => {
    if (message.content.startsWith('!champions')) {
  
        // Retira a Exclamação da mensagem.
        var arrayMessage = message.content.split(""); 
        for(var i=0;i<10;i++){
        arrayMessage.shift();
        }
        var nickname = arrayMessage.join("");

        function doRequest(url) {
            return new Promise(function (resolve, reject) {
                request(url, function (error, res, body) {
                    if (!error && res.statusCode == 200) {
                        resolve(body);
                    } else {
                        reject(error);
                    }
                });
            });
        }

        var bodySummonerByName = await doRequest({ headers, uri: `https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${nickname}`});
        bodySummonerByName = JSON.parse(bodySummonerByName);

        var accountId = bodySummonerByName.id;
        nickname = bodySummonerByName.name;

        var bodyChampionMasteryBySummoner = await doRequest({ headers, uri: `https://br1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${accountId}`});
        bodyChampionMasteryBySummoner = JSON.parse(bodyChampionMasteryBySummoner);

        var maxShow = 5; // Quantidade de champions que vai mostrar
        var arrayPrint = String();

        for(loop in bodyChampionMasteryBySummoner){
            if(loop >= maxShow){
                break;
            }

            let championsData = champions.data;
            let position = bodyChampionMasteryBySummoner[loop];
            var championName;

            for(champion in championsData){
                if(championsData[champion].key == position.championId){
                    championName = championsData[champion].name;
                }
            }

            let index = parseInt(loop) + 1;
            arrayPrint += index+" | Champion: **"+championName+"** | Pontos de Maestria: **"+position.championPoints+"** | Nivel da Maestria: **"+position.championLevel+"**\n";               
        }

        var embed = new RichEmbed();
        embed
        .setTitle(`>> Maestrias de ${nickname}:`)
        .setColor(0x00FF00)
        .setDescription(arrayPrint);

        message.channel.send(embed);
    }
  });

  client.login(tokenbot);