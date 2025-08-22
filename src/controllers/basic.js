const messages = require('../views/message');
const {
    user
} = require('../models');

module.exports = {
  start: async (msg, match, bot) => {
    const opts = {
      reply_markup: {
        keyboard: [
          [{ text: '/help' }, { text: '/saldo' }, { text: '/server_list' }],
          [{ text: '/topup' }, { text: '/qr' }, { text: '/buttons' }]
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      }
    };

    const userId = msg.from.id;
    const userData = await user.findOne({ where: { id: userId } });
    if (!userData) {
      await user.create({ id: userId, saldo: 0 });
    }
  
    const name = msg.from.first_name || 'there';
    bot.sendMessage(msg.chat.id, `Hello, ${name}! Welcome to the bot. Use /start to see commands.`, opts);
  },

  help: (msg, match, bot) => {
    bot.sendMessage(msg.chat.id, messages.help, { parse_mode: 'Markdown' });
  },

  handleCallback: (callbackQuery, bot) => {
    const msg = callbackQuery.message;
    const data = callbackQuery.data;

    // callback to another path based on data
    if (data === 'some_action') {
      if (msg && msg.chat && msg.chat.id) {
      bot.sendMessage(msg.chat.id, 'You triggered some action!');
      }
    } else if (data === 'help') {
      module.exports.help(msg, null, bot);
    } else if (data === 'start') {
      module.exports.start(msg, null, bot);
    }
    
  }
}