const messages = require('../views/message');
const qrcode= require('qrcode');

module.exports = {
  start: async (msg, match, bot) => {
    const opts = {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Help', callback_data: 'help' }, { text: 'Check Saldo', callback_data: 'saldo' }, { text: 'Server List', callback_data: 'server_list' }],
          [{ text: 'Top Up', callback_data: 'top_up' }, { text: 'QR Code', callback_data: 'qr' }, { text: 'Buttons', callback_data: 'buttons' }]
        ]
      }
    };
    const name = msg.from.first_name || 'there';
    bot.sendMessage(msg.chat.id, `Hello, ${name}! Welcome to the bot. Use /help to see commands.`, opts);
  },

  help: (msg, match, bot) => {
    bot.sendMessage(msg.chat.id, messages.help, { parse_mode: 'Markdown' });
  },

  qr: (msg, match, bot) => {
    const text = match[1] || 'No text provided';
    qrcode.toFile(`./qr/qr-${msg.chat.id}.png`, text, { errorCorrectionLevel: 'H' }, (err) => {
    if (err) {
      console.log(err);
      bot.sendMessage(msg.chat.id, 'Error generating QR code.');
      return;
    }
    bot.sendPhoto(msg.chat.id, `./qr/qr-${msg.chat.id}.png`, { caption: 'Here is your QR code:' });
    });
  },

  handleCallback: (callbackQuery, bot) => {
    const msg = callbackQuery.message;
    const data = callbackQuery.data;

    if (data === 'say_hi') {
      bot.sendMessage(msg.chat.id, '👋 Hi there!');
    } else if (data === 'help') {
      bot.sendMessage(msg.chat.id, messages.help, { parse_mode: 'Markdown' });
    } else if (data === 'buttons') {
      module.exports.buttons(msg, null, bot);
    }

    bot.answerCallbackQuery(callbackQuery.id);
  },

  echo: (msg, match, bot) => {
    const text = msg.text;
    if (!text.startsWith('/')) {
      bot.sendMessage(msg.chat.id, `You said: "${text}"`);
    }
  }
}