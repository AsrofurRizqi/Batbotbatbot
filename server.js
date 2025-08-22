require('dotenv').config({});
const TelegramBot = require('node-telegram-bot-api');
const { token } = require('./src/config/config');
const express = require('express');
const bodyParser = require('body-parser');
const botRoutes = require('./src/routes');
const apiRoutes = require('./src/routes/api');

const app = express();
app.use(bodyParser.json());
const bot = new TelegramBot(
    token, 
    { 
        polling: true,
        debug: true, 
    }
);
botRoutes(bot);
apiRoutes(app);

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port 3000');
});
