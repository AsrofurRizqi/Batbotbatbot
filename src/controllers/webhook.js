const {
    user,
    transaksi
} = require('../models');

module.exports = {
    async status(req, res) {
        try {
            const userCount = await user.count();
            const transaksiCount = await transaksi.count();

            res.status(200).json({
                status: 'ok',
                userCount,
                transaksiCount
            });
        } catch (error) {
            console.error('Error fetching status:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};