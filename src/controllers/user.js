const userMessage = require('../views/userMessage');
const {
    user
} = require('../models');

module.exports = {
    saldo: async (msg, match, bot) => {
        const userId = msg.from.id;
        const userData = await user.findOne({ where: { id: userId } });

        const saldo = userData.saldo || 0;
        bot.sendMessage(msg.chat.id, `Your current saldo is: ${saldo} coins`);
    },

    userSince: async (msg, match, bot) => {
        const userId = msg.from.id;
        const userData = await user.findOne({ where: { id: userId } });

        if (!userData) {
            return bot.sendMessage(msg.chat.id, 'User not found.');
        }

        const createdAt = userData.createdAt;
        const since = new Date(createdAt);
        const now = new Date();
        const diffTime = Math.abs(now - since);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        bot.sendMessage(msg.chat.id, `You have been a member for ${diffDays} days.`);
    }
}