exports.start = (msg) => {
  const name = msg.from.first_name || 'there';
  return `Hello, ${name}! Welcome to the bot. Use /help to see commands.`;
};

exports.help = `Batbotbatbot is a bot that helps you with various tasks`;
