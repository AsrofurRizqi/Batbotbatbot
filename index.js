require("dotenv").config({})
const TelegramBot = require('node-telegram-bot-api');
const { token } = require('./src/config/config');
const registerRoutes = require('./src/routes');

const bot = new TelegramBot(
    token, 
    { 
        polling: true ,
        debug: true,
    }
);


registerRoutes(bot);

console.log('batbotbatbot...');
