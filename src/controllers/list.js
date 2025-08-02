const {
    server
} = require('../models');
const listMessage = require('../views/listMessage');

module.exports = {
    listServers: async (msg, match, bot) => {
        const servers = await server.findAll();
        if (servers.length === 0) {
            return bot.sendMessage(msg.chat.id, 'No servers available.');
        }

        const serverList = servers.map(s => `- ${s.name} (${s.status})`).join('\n');
        bot.sendMessage(msg.chat.id, listMessage(serverList));
    }
}