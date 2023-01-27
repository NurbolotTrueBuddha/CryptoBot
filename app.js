// register
// login
// create wallet
// get wallets
// add wallet
// add reciever wallet
// get receiever wallet
// send bnb
// get status of transaction
// get all my transaction
// receiving event
// who sended me bnb <10:12:22 - 10:1:23>

import TelegramBot from 'node-telegram-bot-api';
import Validate from './validate.js';
import Handler from './handler.js';



const token = '5913924474:AAGHbjA1OpN3esWTdnWj0lmlok8doYaFwbw';
const bot = new TelegramBot(token, { polling: true });
let rpcUrl = 'https://old-alpha-silence.bsc-testnet.discover.quiknode.pro/254b2d7e40b37a164f2dd8898e81c3ab2775d7a3/';
let handler = new Handler(bot, rpcUrl);
let validate = new Validate(handler);
bot.on('message', (msg) => {
    validate.validateMsg(msg)
})



