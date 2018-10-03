
/**
 * Arttu Nevalainen
 * 2018
 */

const axios = require('axios');
const Bot = require('node-telegram-bot-api');
const token = require('./token.json').token;


const bot = new Bot(token, {polling: true});


/** Bot message function. Gets all messages of the channel and waits for call "@gambinabot"
 * SHOULD BE CHANGED!
 */
bot.on('message', (msg) => {
    let message = msg.text.split(" ");

    if(message[0] === "@gambinabot") {
        //Help response
        if(message[1].toLowerCase() === "help") {
            bot.sendMessage(msg.chat.id, "Anna kaupungin nimi esim. @gambinabot Tampere");
        }
        //The rest...
        else {
            getAlko(msg.text).then((alkot) => {
                if(alkot === "Alkoa ei löytynyt") {
                    bot.sendMessage(msg.chat.id, alkot);
                }
                else if(alkot.length > 0) {
                    bot.sendMessage(msg.chat.id, "Gambinaa on: \n" + alkot);
                }
                else {
                    bot.sendMessage(msg.chat.id, "Virhe. Ilmoita ylläpidolle");
                }
            });
        }
    }
});

let alkot = [];
getData();
setTimeout(getData, 600000);


/** Fetch gambina data from alko.fi */
function getData() {
    alkot = [];

    axios.get('https://www.alko.fi/INTERSHOP/web/WFS/Alko-OnlineShop-Site/fi_FI/-/EUR/ViewProduct-Include?SKU=319027').then((res) => {

        let wasd = res.data.split("</a>");
        wasd.forEach(line => {
            line = line.split(/<[^>]+>/g);
            line[4] = line[4].replace(/&auml;/g, 'ä');
            line[4] = line[4].replace(/&Auml;/g, 'Ä');
            line[4] = line[4].replace(/&ouml;/g, 'ö');
            line[4] = line[4].replace(/&Ouml;/g, 'Ö');
            line[4] = line[4].replace("Alko ", "");

            alkot.push({ alko: line[4], lkm: line[6] });
        });

        alkot.shift();
        alkot.shift();

        console.log("Gambinat kassissa!");
    }).catch(function (error) {
        console.log(error);
    });
}

/** Search for given city and return all alkos in that city */
async function getAlko(alkoname) {
    try {
        alkoname = alkoname.split(" ");
        let kaupungit= [];

        alkot.forEach(alko => {
            let splittedalko = alko.alko.split(" ");

            if(splittedalko[0].toLowerCase() === alkoname[1].toLowerCase()) {
                kaupungit.push(alko);
            }
        });

        if(kaupungit.length > 0) {
            console.log(kaupungit);
            let response = "";

            for(let i = 0; i < kaupungit.length; i++) {
                response = response + kaupungit[i].alko + " " + kaupungit[i].lkm + "\n";
            }

            return response;
        }
        else {
            return "Alkoa ei löytynyt";
        }
    }
    catch(e) {
        return "";
    }
}
