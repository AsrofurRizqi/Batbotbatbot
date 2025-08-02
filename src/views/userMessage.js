exports.saldo = (msg, saldo) => {
  const name = msg.from.first_name || 'there';
  return `Hello, ${name}! Your current saldo is: ${saldo} units.`;
}