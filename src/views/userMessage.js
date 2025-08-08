module.exports = {
    saldo: (msg, saldo) => {
        if (isNaN(saldo) || saldo < 0) {
            return 'Invalid saldo value.';
        }
      const name = msg.from.first_name || 'there';
      return `Hello, ${name}! Your current saldo is: ${saldo} units.`;
    }
}