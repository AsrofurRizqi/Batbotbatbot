const {
    user
} = require('../models');
const testPayMessage = require('../views/testPayMessage');

module.exports = {
    addSaldo: async (msg, match, bot) => {
        const userId = msg.from.id;
        const amount = parseFloat(match[1]);

        if (isNaN(amount) || amount <= 0) {
            return bot.sendMessage(msg.chat.id, 'Please provide a valid amount to add.');
        }

        // payment gateway integration would go here

        try {
            const existingUser = await user.findOne({ where: { id: userId } });
            if (!existingUser) {
                return bot.sendMessage(msg.chat.id, 'User not found.');
            }

            existingUser.saldo += amount;
            await existingUser.save();

            bot.sendMessage(msg.chat.id, testPayMessage(existingUser.saldo));
        } catch (error) {
            console.error('Error adding saldo:', error);
            bot.sendMessage(msg.chat.id, 'An error occurred while adding saldo. Please try again later.');
        }
    },

    addSaldoMessage: (msg, bot) => {
        const helpMessage = `To add saldo, use the command:
        /addsaldo <amount>
        Example: /addsaldo 100
        This will add the specified amount to your saldo.`; 
        bot.sendMessage(msg.chat.id, helpMessage);
    },

    addSaldoKeyboard: (msg, bot) => {
        const keyboard = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Add Saldo', callback_data: 'add_saldo' }],
                    [{ text: 'Help', callback_data: 'add_saldo_help' }]
                ]
            }
        };
        bot.sendMessage(msg.chat.id, 'Choose an option:', keyboard);
    }
}