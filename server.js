// express webhook server
const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
const { token } = require('./src/config/config');
const registerRoutes = require('./src/routes');
const app = express();
app.use(bodyParser.json());
const bot = new TelegramBot(token, { polling: true });
registerRoutes(bot);
app.get('/', (req, res) => {
    res.send('Telegram Bot is running...');
});
app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port 3000');
});
