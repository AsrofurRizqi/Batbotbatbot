const webhookController = require('../controllers/webhook');

module.exports = (app) => {
    app.get('/api/status', webhookController.status);
    app.post('/api/list', webhookController.addListServer);
    app.get('/api/list', webhookController.getAllList);
    app.delete('/api/list/:id', webhookController.deleteList);
    app.put('/api/list/:id', webhookController.updateList);
}