const Todo = require('../models/todo.model');
const wrapper = require('../utils/wrapper');

// internal functions
let isValid = (todo) => {
    if (!todo.description) {
        return { isValid: false, propertyInvalid: "description" };
    } else if (!todo.idUser) {
        return { isValid: false, propertyInvalid: "idUser" };
    } else {
        return { isValid: true, propertyInvalid: undefined }
    }
}

// Returns todo model (metadata)
exports.metadata = (req, res) => {
    let response = { "status": "ok", "message": "Todo metadata queried successfully", "error": false, "data": Todo.schema.paths };
    return wrapper.sendResponse({ method: "GET /api/todo/metadata", response: response, httpCode: 200, res: res });
};

// Create and Save a new Todo
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        let response = { "status": "error", "message": "Todo content can not be empty", "error": true, "data": undefined };
        return wrapper.sendResponse({ method: "POST /api/todo", response: response, httpCode: 400, res: res });
    } else {
        // Create a todo
        const newTodo = new Todo({
            description: req.body.description,
            done: req.body.done,
            idUser: req.id
        });

        let validation = isValid(newTodo);
        if (!validation.isValid) {
            let response = { "status": "error", "message": "Todo " + validation.propertyInvalid + " property is required", "error": true, "data": newTodo };
            return wrapper.sendResponse({ method: "POST /api/todo", response: response, httpCode: 400, res: res });
        } else {
            // save todo in Database
            newTodo.save()
                .then(data => {
                    let response = { "status": "ok", "message": "Todo saved successfully", "error": false, "data": data };
                    return wrapper.sendResponse({ method: "POST /api/todo", response: response, httpCode: 202, res: res });
                }).catch(error => {
                    let response = { "status": "error", "message": "Some error occurred while creating the Todo", "error": true, "data": error.message || undefined };
                    return wrapper.sendResponse({ method: "POST /api/todo", response: response, httpCode: 500, res: res });
                });
        }
    }
};

// Retrieve and return all todos from the database.
exports.findAll = (req, res) => {
    Todo.find({ idUser: req.id })
        .then(todos => {
            if (todos && todos.length > 0) {
                let response = { "status": "ok", "message": "Todos queried successfully", "error": false, "data": todos };
                return wrapper.sendResponse({ method: "GET /api/todo", response: response, httpCode: 200, res: res });
            } else {
                let response = { "status": "ok", "message": "There is no data", "error": false, "data": undefined };
                return wrapper.sendResponse({ method: "GET /api/todo", response: response, httpCode: 200, res: res });
            }
        }).catch(error => {
            let response = { "status": "error", "message": "Some error occurred while retrieving todos", "error": true, "data": error.message || undefined };
            return wrapper.sendResponse({ method: "GET /api/todo", response: response, httpCode: 500, res: res });
        });
};

// Find a single todo with a id
exports.findOne = (req, res) => {
    Todo.findById(req.params.id)
        .then(todo => {
            if (!todo) {
                let response = { "status": "error", "message": "Todo not found with id " + req.params.id, "error": true, "data": undefined };
                return wrapper.sendResponse({ method: "GET /api/todo/" + req.params.id, response: response, httpCode: 404, res: res });
            } else {
                let response = { "status": "ok", "message": "Todo queried successfully", "error": false, "data": todo };
                return wrapper.sendResponse({ method: "GET /api/todo/" + req.params.id, response: response, httpCode: 200, res: res });
            }
        }).catch(error => {
            if (error.kind === 'ObjectId') {
                let response = { "status": "error", "message": "Todo not found with id " + req.params.id, "error": true, "data": undefined };
                return wrapper.sendResponse({ method: "GET /api/todo/" + req.params.id, response: response, httpCode: 404, res: res });
            } else {
                let response = { "status": "error", "message": "Error retrieving todo with id " + req.params.id, "error": true, "data": error.message || undefined };
                return wrapper.sendResponse({ method: "GET /api/todo", response: response, httpCode: 500, res: res });
            }
        });
};

// Update a todo identified by the id in the request
exports.update = (req, res) => {
    // Validate request
    if (!req.body) {
        let response = { "status": "error", "message": "Todo content can not be empty", "error": true, "data": undefined };
        return wrapper.sendResponse({ method: "PUT /api/todo", response: response, httpCode: 400, res: res });
    } else {
        // Create a Todo based on existing Todo
        const todoToUpdate = {
            id: req.body._id,
            description: req.body.description,
            done: req.body.done,
            idUser: req.id
        };

        let validation = isValid(todoToUpdate);
        if (!validation.isValid) {
            let response = { "status": "error", "message": "Todo " + validation.propertyInvalid + " is required", "error": true, "data": todoToUpdate };
            return wrapper.sendResponse({ method: "PUT /api/todo", response: response, httpCode: 400, res: res });
        } else {
            // Find todo and update it with the request body
            Todo.findByIdAndUpdate(req.body._id, todoToUpdate, { new: true, upsert: true })
                .then(todo => {
                    if (!todo) {
                        let response = { "status": "error", "message": "Some error ocurred while updating the todo with id" + req.body._id, "error": true, "data": undefined };
                        return wrapper.sendResponse({ method: "PUT /api/todo", response: response, httpCode: 404, res: res });
                    } else {
                        let response = { "status": "ok", "message": "Todo updated successfully", "error": false, "data": todo };
                        return wrapper.sendResponse({ method: "PUT /api/todo", response: response, httpCode: 202, res: res });
                    }
                }).catch(error => {
                    if (error.kind === 'ObjectId') {
                        let response = { "status": "error", "message": "Todo not found", "error": true, "data": undefined };
                        return wrapper.sendResponse({ method: "PUT /api/todo", response: response, httpCode: 404, res: res });
                    } else {
                        let response = { "status": "error", "message": "Some error occurred while updating the todo", "error": true, "data": error.message || undefined };
                        return wrapper.sendResponse({ method: "PUT /api/todo", response: response, httpCode: 500, res: res });
                    }
                });
        }
    }
};

// Delete a todo with the specified id in the request
exports.delete = (req, res) => {
    Todo.findByIdAndRemove(req.params.id)
        .then(todo => {
            if (!todo) {
                let response = { "status": "error", "message": "Todo not found with id " + req.params.id, "error": true, "data": undefined };
                return wrapper.sendResponse({ method: "DELETE /api/todo", response: response, httpCode: 404, res: res });
            } else {
                let response = { "status": "ok", "message": "Todo deleted successfully", "error": false, "data": undefined };
                return wrapper.sendResponse({ method: "DELETE /api/todo/" + req.params.id, response: response, httpCode: 202, res: res });
            }
        }).catch(error => {
            if (error.kind === 'ObjectId' || error.name === 'NotFound') {
                let response = { "status": "error", "message": "Todo not found", "error": true, "data": undefined };
                return wrapper.sendResponse({ method: "DELETE /api/todo", response: response, httpCode: 404, res: res });
            } else {
                let response = { "status": "error", "message": "Could not delete todo with id " + req.params.id, "error": true, "data": error.message || undefined };
                return wrapper.sendResponse({ method: "DELETE /api/todo", response: response, httpCode: 500, res: res });
            }
        });
};

// Change state of the todo with the specified id in the request
exports.changeState = (req, res) => {
    Todo.findById(req.params.id)
        .then(todo => {
            if (!todo) {
                let response = { "status": "error", "message": "Todo not found with id " + req.params.id, "error": true, "data": undefined };
                return wrapper.sendResponse({ method: "PATCH /api/todo/" + req.params.id, response: response, httpCode: 404, res: res });
            } else {
                const todoToUpdate = {
                    _id: todo._id,
                    description: todo.description,
                    idUser: todo.idUser,
                    done: !todo.done
                };
                Todo.findByIdAndUpdate(req.params.id, todoToUpdate, { new: true, upsert: true, })
                    .then(todo => {
                        if (!todo) {
                            let response = { "status": "error", "message": "Some error ocurred while updating the todo with id" + req.params.id, "error": true, "data": undefined };
                            return wrapper.sendResponse({ method: "PATCH /api/todo", response: response, httpCode: 404, res: res });
                        } else {
                            let response = { "status": "ok", "message": "Todo updated successfully", "error": false, "data": todo };
                            return wrapper.sendResponse({ method: "PATCH /api/todo", response: response, httpCode: 202, res: res });
                        }
                    }).catch(error => {
                        if (error.kind === 'ObjectId') {
                            let response = { "status": "error", "message": "Todo not found", "error": true, "data": undefined };
                            return wrapper.sendResponse({ method: "PATCH /api/todo", response: response, httpCode: 404, res: res });
                        } else {
                            let response = { "status": "error", "message": "Some error occurred while updating the todo", "error": true, "data": error.message || undefined };
                            return wrapper.sendResponse({ method: "PATCH /api/todo", response: response, httpCode: 500, res: res });
                        }
                    });
            }
        }).catch(error => {
            if (error.kind === 'ObjectId') {
                let response = { "status": "error", "message": "Todo not found with id " + req.params.id, "error": true, "data": undefined };
                return wrapper.sendResponse({ method: "PATCH /api/todo/" + req.params.id, response: response, httpCode: 404, res: res });
            } else {
                let response = { "status": "error", "message": "Error retrieving todo with id " + req.params.id, "error": true, "data": error.message || undefined };
                return wrapper.sendResponse({ method: "PATCH /api/todo", response: response, httpCode: 500, res: res });
            }
        });
};