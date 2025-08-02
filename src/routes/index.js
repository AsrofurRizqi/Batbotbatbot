const basicCommand = require('../controllers/basic');

module.exports = (bot) => {
  bot.onText(/start/, (msg, match) => {
    basicCommand.start(msg, match, bot);
  });
  bot.onText(/help/, (msg, match) => {
    basicCommand.help(msg, match, bot);
  });
  bot.onText(/qr (.+)/, (msg, match) => {
    basicCommand.qr(msg, match, bot);
  });
  bot.on('callback_query', (callbackQuery) => {
    basicCommand.handleCallback(callbackQuery, bot);
  });
  bot.on('message', (msg, match) => {
    basicCommand.echo(msg, match, bot);
  });
  bot.on("polling_error", console.log);
};