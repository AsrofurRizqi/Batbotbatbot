const {
    user,
    transaksi,
    list
} = require('../models');
const bcrypt = require('bcrypt');

function authBcrypt(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return false;
    }
    const compare = bcrypt.compareSync(authHeader, process.env.WEBHOOK_PASSWORD_HASH);
    if (!compare) {
        return false;
    }
}

module.exports = {
    async status(req, res) {
        try {
            if (!authBcrypt(req)) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
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
    },

    addListServer: async (req, res) => {
        try {
            if (!authBcrypt(req)) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const { nama, harga, validity, stock } = req.body;
            if (!nama || !harga || !validity || !stock) {
                return res.status(400).json({ error: 'All fields are required' });
            }
            const newList = await list.create({ nama, harga, validity, stock });
            res.status(201).json(newList);
        } catch (error) {
            console.error('Error adding list:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getAllList: async (req, res) => {
        try {
            if (!authBcrypt(req)) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const lists = await list.findAll();
            res.status(200).json(lists);
        } catch (error) {
            console.error('Error fetching lists:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    deleteList: async (req, res) => {
        try {
            if (!authBcrypt(req)) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const { id } = req.params;
            const deleted = await list.destroy({ where: { id } });
            if (deleted) {
                return res.status(200).json({ message: 'List deleted successfully' });
            }
            res.status(404).json({ error: 'List not found' });
        } catch (error) {
            console.error('Error deleting list:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    updateList: async (req, res) => {
        try {
            if (!authBcrypt(req)) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const { id } = req.params;
            const { nama, harga, validity, stock } = req.body;
            const [updated] = await list.update(
                { nama, harga, validity, stock },
                { where: { id } }
            );
            if (updated) {
                const updatedList = await list.findOne({ where: { id } });
                return res.status(200).json(updatedList);
            }
            res.status(404).json({ error: 'List not found' });
        } catch (error) {
            console.error('Error updating list:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

};