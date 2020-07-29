const User = require('../models/user.model');
const wrapper = require('../utils/wrapper');
const bcrypt = require('bcryptjs');

// internal functions
let isValid = (user) => {
    if (!user.username) {
        return { isValid: false, propertyInvalid: "username" };
    } else if (!user.password) {
        return { isValid: false, propertyInvalid: "password" };
    } else {
        return { isValid: true, propertyInvalid: undefined }
    }
}

// Returns user model (metadata)
exports.metadata = (req, res) => {
    let response = { "status": "ok", "message": "User metadata queried successfully", "error": false, "data": User.schema.paths };
    return wrapper.sendResponse({ method: "GET /api/user/metadata", response: response, httpCode: 200, res: res });
};

// Create and Save a new User
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        let response = { "status": "error", "message": "User content can not be empty", "error": true, "data": undefined };
        return wrapper.sendResponse({ method: "POST /api/register", response: response, httpCode: 400, res: res });
    } else {
        // Create a User
        const newUser = new User({
            username: req.body.username,
            password: req.body.password,
            name: req.body.name,
            email: req.body.email
        });

        let validation = isValid(newUser);
        if (!validation.isValid) {
            let response = { "status": "error", "message": "User " + validation.propertyInvalid + " is required", "error": true, "data": newUser };
            return wrapper.sendResponse({ method: "POST /api/register", response: response, httpCode: 400, res: res });
        } else {
            // encrypt password
            newUser.password = bcrypt.hashSync(newUser.password, 8);
            // save user in Database
            newUser.save()
                .then(data => {
                    let response = { "status": "ok", "message": "User saved successfully", "error": false, "data": data };
                    return wrapper.sendResponse({ method: "POST /api/register", response: response, httpCode: 202, res: res });
                }).catch(error => {
                    let response = { "status": "error", "message": "Some error occurred while creating the User", "error": true, "data": error.message || undefined };
                    return wrapper.sendResponse({ method: "POST /api/register", response: response, httpCode: 500, res: res });
                });
        }
    }
};

// Retrieve and return all users from the database.
exports.findAll = (req, res) => {
    User.find()
        .then(users => {
            if (users && users.length > 0) {
                let response = { "status": "ok", "message": "Users queried successfully", "error": false, "data": users };
                return wrapper.sendResponse({ method: "GET /api/user", response: response, httpCode: 200, res: res });
            } else {
                let response = { "status": "ok", "message": "no data", "error": false, "data": undefined };
                return wrapper.sendResponse({ method: "GET /api/user", response: response, httpCode: 200, res: res });
            }
        }).catch(error => {
            let response = { "status": "error", "message": "Some error occurred while retrieving users", "error": true, "data": error.message || undefined };
            return wrapper.sendResponse({ method: "GET /api/user", response: response, httpCode: 500, res: res });
        });
};

// Find a single user with a id
exports.findOne = (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            if (!user) {
                let response = { "status": "error", "message": "User not found with id " + req.params.id, "error": true, "data": undefined };
                return wrapper.sendResponse({ method: "GET /api/user/" + req.params.id, response: response, httpCode: 404, res: res });
            } else {
                let response = { "status": "ok", "message": "User queried successfully", "error": false, "data": user };
                return wrapper.sendResponse({ method: "GET /api/user/" + req.params.id, response: response, httpCode: 200, res: res });
            }
        }).catch(error => {
            if (error.kind === 'ObjectId') {
                let response = { "status": "error", "message": "User not found with id " + req.params.id, "error": true, "data": undefined };
                return wrapper.sendResponse({ method: "GET /api/user/" + req.params.id, response: response, httpCode: 404, res: res });
            } else {
                let response = { "status": "error", "message": "Error retrieving user with id " + req.params.id, "error": true, "data": error.message || undefined };
                return wrapper.sendResponse({ method: "GET /api/user", response: response, httpCode: 500, res: res });
            }
        });
};

// Update a user identified by the id in the request
exports.update = (req, res) => {
    // Validate request
    if (!req.body) {
        let response = { "status": "error", "message": "User content can not be empty", "error": true, "data": undefined };
        return wrapper.sendResponse({ method: "PUT /api/user", response: response, httpCode: 400, res: res });
    } else {
        // Create a user
        const userToUpdate = {
            id: req.body._id,
            username: req.body.username,
            password: req.body.password,
            name: req.body.name,
            email: req.body.email
        };

        let validation = isValid(userToUpdate);
        if (!validation.isValid) {
            let response = { "status": "error", "message": "User " + validation.propertyInvalid + " is required", "error": true, "data": userToUpdate };
            return wrapper.sendResponse({ method: "PUT /api/user", response: response, httpCode: 400, res: res });
        } else {
            // encrypt password
            userToUpdate.password = bcrypt.hashSync(userToUpdate.password, 8);

            // Find user and update it with the request body
            User.findByIdAndUpdate(req.body._id, userToUpdate, { new: true, upsert: true })
                .then(user => {
                    if (!user) {
                        let response = { "status": "error", "message": "Some error ocurred while updating the user with id" + req.body._id, "error": true, "data": undefined };
                        return wrapper.sendResponse({ method: "PUT /api/user", response: response, httpCode: 404, res: res });
                    } else {
                        let response = { "status": "ok", "message": "User updated successfully", "error": false, "data": user };
                        return wrapper.sendResponse({ method: "PUT /api/user", response: response, httpCode: 202, res: res });
                    }
                }).catch(error => {
                    if (error.kind === 'ObjectId') {
                        let response = { "status": "error", "message": "User not found", "error": true, "data": undefined };
                        return wrapper.sendResponse({ method: "PUT /api/user", response: response, httpCode: 404, res: res });
                    } else {
                        let response = { "status": "error", "message": "Some error occurred while updating the user", "error": true, "data": error.message || undefined };
                        return wrapper.sendResponse({ method: "PUT /api/user", response: response, httpCode: 500, res: res });
                    }
                });
        }
    }
};

// Delete a user with the specified id in the request
exports.delete = (req, res) => {
    User.findByIdAndRemove(req.params.id)
        .then(user => {
            if (!user) {
                let response = { "status": "error", "message": "User not found with id " + req.params.id, "error": true, "data": undefined };
                return wrapper.sendResponse({ method: "DELETE /api/user", response: response, httpCode: 404, res: res });
            } else {
                let response = { "status": "ok", "message": "User deleted successfully", "error": false, "data": undefined };
                return wrapper.sendResponse({ method: "DELETE /api/user/" + req.params.id, response: response, httpCode: 202, res: res });
            }
        }).catch(error => {
            if (error.kind === 'ObjectId' || error.name === 'NotFound') {
                let response = { "status": "error", "message": "User not found", "error": true, "data": undefined };
                return wrapper.sendResponse({ method: "DELETE /api/user", response: response, httpCode: 404, res: res });
            } else {
                let response = { "status": "error", "message": "Could not delete user with id " + req.params.id, "error": true, "data": error.message || undefined };
                return wrapper.sendResponse({ method: "DELETE /api/user", response: response, httpCode: 500, res: res });
            }
        });
};