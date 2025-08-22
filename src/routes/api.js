const webhookController = require('../controllers/webhook');

module.exports = (app) => {
    app.get('/api/status', webhookController.status);
}