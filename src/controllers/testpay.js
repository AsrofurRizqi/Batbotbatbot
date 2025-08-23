const {
    user,
    transaksi,
    list
} = require('../models');
const qrcode= require('qrcode');
const qrisDinamis = require('qris-dinamis');
const qris = process.env.QRIS || '00020101021126680014ID.CO.MYACQ.WWW011812345678ID5909TOKO DEMO6007JAKARTA5802ID6304ABCD';
const serverCreateEndpoint = process.env.SERVER_CREATE_ENDPOINT;
const axios = require('axios');
const { pay } = require('../views/testPayMessage');

module.exports = {
    addSaldo: async (msg, match, bot) => {
        const userId = msg.from.id;
        const amount = parseFloat(match[1]);

        if (isNaN(amount)) {
            return bot.sendMessage(msg.chat.id, 'Please provide a valid amount to add.');
        }
        if (amount < 5000) {
            return bot.sendMessage(msg.chat.id, 'The minimum amount to add is 5000 units.');
        }

        try {
            const existingUser = await user.findOne({ where: { id: userId } });
            if (!existingUser) {
                return bot.sendMessage(msg.chat.id, 'User not found.');
            }

            const string = qrisDinamis.makeString(qris, { nominal: `${amount}` });
            const timestring = new Date();
            const date = `${timestring.getFullYear()}${(timestring.getMonth()+1 ).toString().padStart(2, '0')}${timestring.getDate().toString().padStart(2, '0')}${timestring.getHours().toString().padStart(2, '0')}${timestring.getMinutes().toString().padStart(2, '0')}${timestring.getSeconds().toString().padStart(2, '0')}`;

            qrcode.toFile(`./qr/qr-${msg.chat.id}-${date}.png`, string, { errorCorrectionLevel: 'H' }, (err) => {
                if (err) {
                    console.log(err);
                    bot.sendMessage(msg.chat.id, 'Error generating QR code.');
                return;
                }
            });
            await new Promise(resolve => setTimeout(resolve, 500));

            const newTransaksi = await transaksi.create({
                userId: userId,
                type: 'topup',
                listId: null,
                amount: amount,
                trid: `TOPUP${userId}${date}`,
                status: 'pending'
            });

            bot.sendPhoto(msg.chat.id, `./qr/qr-${msg.chat.id}-${date}.png` , { 
                caption: pay(amount),
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Validate Payment ✅', callback_data: `validate_payment_${newTransaksi.id}` }],
                        [{ text: 'Cancel ❌', callback_data: `cancel_payment_${newTransaksi.id}` }]
                    ]
                }
            });
        } catch (error) {
            console.error('Error adding saldo:', error);
            bot.sendMessage(msg.chat.id, 'An error occurred while adding saldo. Please try again later.');
        }
    },

    buyServer: async (msg, match, bot) => {
        const userId = msg.from.id;
        const serverId = parseInt(match[1]);
        const usernameServer = match[2] ? match[2] : msg.from.username;
        
        if (isNaN(serverId)) {
            return bot.sendMessage(msg.chat.id, 'Please provide a valid server ID to purchase.');
        }

        if (usernameServer == msg.from.username) {
            return bot.sendMessage(msg.chat.id, 'Using your Telegram username as the server username default.');
        }

        try {
            const existingUser = await user.findOne({ where: { id: userId } });
            if (!existingUser) {
                return bot.sendMessage(msg.chat.id, 'User not found.');
            }

            const server = await list.findOne({ where: { id: serverId } });
            if (!server) {
                return bot.sendMessage(msg.chat.id, 'Server not found.');
            }

            if (server.stock <= 0) {
                return bot.sendMessage(msg.chat.id, 'Server is out of stock.');
            }

            if (existingUser.saldo < server.price) {
                return bot.sendMessage(msg.chat.id, 'Insufficient saldo. Please top up your saldo.');
            }

            const timestring = new Date();
            const date = `${timestring.getFullYear()}${(timestring.getMonth()+1 ).toString().padStart(2, '0')}${timestring.getDate().toString().padStart(2, '0')}${timestring.getHours().toString().padStart(2, '0')}${timestring.getMinutes().toString().padStart(2, '0')}${timestring.getSeconds().toString().padStart(2, '0')}`;
            const newTransaksi = await transaksi.create({
                userId: userId,
                type: 'purchase',
                listId: serverId,
                amount: server.price,
                trid: `BUY${userId}${serverId}${date}`,
                status: 'completed'
            });
            existingUser.saldo -= server.price;
            await existingUser.save();

            // post to server create endpoint
            const response = await axios.post(`${serverCreateEndpoint}/${server.nama}`, {
                userId: userId,
                serverId: serverId,
                username: usernameServer
            });
            if (response.status !== 200) {
                throw new Error('Failed to create server instance.');
            }
    
            bot.sendMessage(msg.chat.id, `Purchase successful! You have bought server ID ${serverId} for ${server.price} units. Your new saldo is ${existingUser.saldo} units.\n\nServer details:\n${response.data.details}`);
        } catch (error) {
            console.error('Error purchasing server:', error);
            bot.sendMessage(msg.chat.id, 'An error occurred while purchasing the server. Please try again later.');
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