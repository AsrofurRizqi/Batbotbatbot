const {
    user
} = require('../models');
const qrcode= require('qrcode');
const qrisDinamis = require('qris-dinamis');
const qris = '00020101021126680014ID.CO.MYACQ.WWW011812345678ID5909TOKO DEMO6007JAKARTA5802ID6304ABCD';
const testPayMessage = require('../views/testPayMessage');

module.exports = {
    addSaldo: async (msg, match, bot) => {
        const userId = msg.from.id;
        const amount = parseFloat(match[1]);

        if (isNaN(amount) || amount <= 5000) {
            return bot.sendMessage(msg.chat.id, 'Please provide a valid amount to add.');
        }

        // payment gateway integration would go here

        try {
            const existingUser = await user.findOne({ where: { id: userId } });
            if (!existingUser) {
                return bot.sendMessage(msg.chat.id, 'User not found.');
            }

            const string = qrisDinamis.makeString(qris, { nominal: `${amount}` });

            qrcode.toFile(`./qr/qr-${msg.chat.id}.png`, string, { errorCorrectionLevel: 'H' }, (err) => {
                if (err) {
                    console.log(err);
                    bot.sendMessage(msg.chat.id, 'Error generating QR code.');
                return;
                }
            });

            bot.sendPhoto(msg.chat.id, `./qr/qr-${msg.chat.id}.png`, { caption: 'Here is your QR code:' });
        } catch (error) {
            console.error('Error adding saldo:', error);
            bot.sendMessage(msg.chat.id, 'An error occurred while adding saldo. Please try again later.');
        }
    },

    addSaldoMessage: (msg, bot) => {
        const helpMessage = `To add saldo, use the command :
        /topup <amount>
        Example: /topup 5000
        Note: The minimum amount to add is 5000 units.
        This will add the specified amount to your saldo.`; 
        bot.sendMessage(msg.chat.id, helpMessage);
    },

}