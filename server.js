

const axios = require('axios');

const Bot = require('node-telegram-bot-api');
const request = require('request');

const url = 'https://launchlibrary.net/1.3/launch';
const trigger = 'I want to travel!';
const token = '625526793:AAE75GVGYHw1Q2p_31toKXpmI9EC1avbHhM';

const bot = new Bot(token, {polling: true});

bot.on('message', (msg) => {
    getData().then((data) => {
        console.log(data);
    });
    console.log(msg.text);
    bot.sendMessage(msg.chat.id, alkot[0].alko + " " + alkot[0].lkm);
});


let alkot = [];

function getData() {
    axios.get('https://www.alko.fi/INTERSHOP/web/WFS/Alko-OnlineShop-Site/fi_FI/-/EUR/ViewProduct-Include?SKU=319027').then((res) => {
    
        let wasd = res.data.split("</a>");
        wasd.forEach(line => {
            line = line.split(/<[^>]+>/g);
            line[4] = line[4].replace(/&auml;/g, 'ä');
            line[4] = line[4].replace(/&Auml;/g, 'Ä');
            line[4] = line[4].replace(/&ouml;/g, 'ö');
            line[4] = line[4].replace(/&Ouml;/g, 'Ö');
    
            alkot.push({ alko: line[4], lkm: line[6] });
        });
    
        return "kek";
    }).catch(function (error) {
        console.log(error);
    });
}



function getAlko(body) {
    alkot.forEach(alko => {
        if(alko.alko === body.alko) {
            return alko;
        }
    });

    return 'no such alko';
}
