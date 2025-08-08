module.exports = {
    start: (msg) => {
        const name = msg.from.first_name || 'there';
        return `Hello, ${name}! Welcome to Batbotbatbot. How can I assist you today?`;
    },

    help: () => {
        return `Here are the commands you can use:
        /start - Start the bot
        /help - Show this help message
        /saldo - Check your current saldo
        /addsaldo <amount> - Add saldo to your account`;
    }
}
