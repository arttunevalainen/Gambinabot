

const axios = require('axios');
const Bot = require('node-telegram-bot-api');
const token = "625526793:AAE5fbK2FNeYyoZV_MP_wn-S5Qhj2zS0-7Y";


const bot = new Bot(token, {polling: true});


bot.on('message', (msg) => {
    getAlko(msg.text).then((alko) => {
        bot.sendMessage(msg.chat.id, alko.alko + " " + alko.lkm);
    })
});

let alkot = [];
getData();

function getData() {
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

async function getAlko(alkoname) {
    alkoname = alkoname.split(" ");
    let found = null;

    alkot.forEach(alko => {
        console.log(alko);
        let splittedalko = alko.alko.split(" ");

        if(splittedalko[0] === alkoname[1]) {
            console.log("found!");
            found = alko;
        }
        else if(splittedalko[1] === alkoname[1]) {
            console.log("found!");
            found = alko;
        }
        else if(splittedalko[2] === alkoname[1]) {
            console.log("found!");
            found = alko;
        }
    });

    if(found != null) {
        return found;
    }
    else {
        return {alko: "Alko not found.", lkm: "" };
    }
}
