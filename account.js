const { tokenapiriot, tokenbot } = require('./consts.json');

const request = require('request');
const champions = require('./champions-pt_BR-9.21.1.json');

const { Client, RichEmbed } = require('discord.js');
var client = new Client();

client.on('ready', () => {
    console.log(`Account controller is ready!`);
});

var headers = {
    "X-Riot-Token": tokenapiriot
}

client.on('message', message => {
    if (message.content.startsWith('!matches')) {
  
      // Retira a Exclamação da mensagem.
      var arrayMessage = message.content.split(""); 
      for(var i=0;i<8;i++){
        arrayMessage.shift();
      }
      var textMessage = arrayMessage.join("");
  
      var accountName;
      var accountId;
  
      var embed = new RichEmbed()
  
      request({ headers, uri: `https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${textMessage}` }, async (err, res, body) => {
        var body = JSON.parse(body);
  
        if(!body.name){
          embed
          .setTitle(`>> Conta inexistente!`)
          // Set the color of the embed
          .setColor(0xFF0000)
          // Set the main content of the embed
          .setDescription(`A conta **${textMessage}** não foi encontrada, verifique se escreveu corretamente o nick.`);
          // Send the embed to the same channel as the message
          message.channel.send(embed);
          return;
        }
  
        accountName = body.name;
        accountId = body.accountId;
        
        var arrayPrint = "";
        var quantMostrar = 5; // Quantidade de jogos que vai ser mostrado
    
        request({headers, uri: `https://br1.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}`}, async function (err, res, body) {
            var body1 = JSON.parse(body);
            var matchId;

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

            for(c in body1.matches){
                if(c >= (quantMostrar)){
                    break;
                }

                matchId = body1.matches[c].gameId;

                let body2 = await doRequest({headers, uri: `https://br1.api.riotgames.com/lol/match/v4/matches/${matchId}`});
                body2 = JSON.parse(body2);
    
                var participantId;
                var team;

                for(var i=0;i<10;i++){
                    body2.participantIdentities[i].player.summonerName == accountName ? participantId = (i + 1) : null; 
                }

                participantId > 4 ? team = 1 : team = 0;

                var win = body2.teams[team].win;
                win == "Fail" ? win = "DERROTA" : win = "VITORIA";

                var name = body1.matches[c].champion;

                var response = champions.data;

                for(champion in response){
                    if(response[champion].key == name){
                        name = response[champion].name;
                    }
                }

                let index = parseInt(c) + 1;

                if(win == "DERROTA"){
                    arrayPrint += "```diff\n-"+index+" | Champion: "+name+" | Season: "+(body1.matches[c].season - 4)+" | Lane: "+body1.matches[c].lane+" | Resultado: "+win+"\n```";               
                } else{
                    arrayPrint += "```xl\n'"+index+" | Champion: "+name+" | Season: "+(body1.matches[c].season - 4)+" | Lane: "+body1.matches[c].lane+" | Resultado: "+win+"'\n```";
                }
            }

    
            embed
            // Set the title of the field
            .setTitle(`>> Ultimos jogos de ${accountName}:`)
            // Set the color of the embed
            .setColor(0x00FF00)
            // Set the main content of the embed
            .setDescription(arrayPrint);
            // Send the embed to the same channel as the message
            message.channel.send(embed);
        });
      });
    }
  });

  client.login(tokenbot);