module.exports = (app) => {
    const todos = require('../controllers/todo.controller');
    const verifyToken = require('../auth/verifyToken');

    // Retrieve Todo metadata
    app.get('/api/todo/metadata', verifyToken, todos.metadata);

    // Retrieve all todos
    app.get('/api/todo', verifyToken, todos.findAll);

    // Retrieve a single Todo with id
    app.get('/api/todo/:id', verifyToken, todos.findOne);

    // Create a new Todo
    app.post('/api/todo', verifyToken, todos.create);

    // Update a Todo
    app.put('/api/todo', verifyToken, todos.update);

    // Delete a Todo with id
    app.delete('/api/todo/:id', verifyToken, todos.delete);

    // Change state of the existing Todo with id
    app.patch('/api/todo/:id', verifyToken, todos.changeState);
}