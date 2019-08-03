module.exports = (app) => {
    const users = require('../controllers/user.controller.js');
    const verifyToken = require('../auth/verifyToken.js');

    // Retrieve user metadata
    app.get('/api/user/metadata', verifyToken, users.metadata);

    // Retrieve all users
    app.get('/api/user', verifyToken, users.findAll);

    // Retrieve a single user with id
    app.get('/api/user/:id', verifyToken, users.findOne);

    // Create a new user by de way post
    app.post('/api/user', verifyToken, users.create);

    // Create a new user by the way register
    app.post('/api/register', users.create);

    // Update a user
    app.put('/api/user', verifyToken, users.update);

    // Delete a user with id
    app.delete('/api/user/:id', verifyToken, users.delete);
}