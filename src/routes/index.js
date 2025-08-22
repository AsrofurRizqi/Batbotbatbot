const basicCommand = require('../controllers/basic');
const testPayCommand = require('../controllers/testpay');
const list = require('../controllers/list');
const user = require('../controllers/user');

module.exports = (bot) => {
  // basic commands
  bot.onText(/start/, (msg, match) => {
    basicCommand.start(msg, match, bot);
  });
  bot.onText(/help/, (msg, match) => {
    basicCommand.help(msg, match, bot);
  });

  // user commands
  bot.onText(/topup (.+)/, (msg, match) => {
    testPayCommand.addSaldo(msg, match, bot);
  });
  bot.onText(/topup_help/, (msg) => {
    testPayCommand.addSaldoMessage(msg, bot);
  });
  bot.onText(/server_list/, (msg) => {
    list.listServers(msg, null, bot);
  });
  bot.onText(/saldo/, (msg) => {
    user.saldo(msg, null, bot);
  });

  // Handle callback queries
  bot.on('callback_query', (callbackQuery) => {
    basicCommand.handleCallback(callbackQuery, bot);
  });
  bot.on("polling_error", console.log);
};