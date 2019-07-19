const Student = require('../models/student.model.js');
const wrapper = require('../utils/wrapper.js');

// internal functions
let isValid = (student) => {
    if (!student.name) {
        return { isValid: false, propertyInvalid: "name" };
    } else if (!student.surname) {
        return { isValid: false, propertyInvalid: "surname" };
    } else if (!student.email) {
        return { isValid: false, propertyInvalid: "email" };
    } else {
        return { isValid: true, propertyInvalid: undefined }
    }
}

// Returns student model (metadata)
exports.metadata = (req, res) => {
    let response = { "status": "ok", "message": "Student metadata queried successfully", "error": false, "data": Student.schema.paths };
    wrapper.sendResponse({ method: "GET /api/student/metadata", response: response, httpCode: 200, res: res });
};

// Create and Save a new Student
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        let response = { "status": "error", "message": "Student content can not be empty", "error": true, "data": undefined };
        wrapper.sendResponse({ method: "POST /api/student", response: response, httpCode: 400, res: res });
    } else {
        // Create a Student
        const newStudent = new Student({
            name: req.body.name,
            surname: req.body.surname,
            birthdate: req.body.birthdate,
            gender: req.body.gender,
            email: req.body.email
        });

        let validation = isValid(newStudent);
        if (!validation.isValid) {
            let response = { "status": "error", "message": "Student " + validation.propertyInvalid + " is required", "error": true, "data": newStudent };
            wrapper.sendResponse({ method: "POST /api/student", response: response, httpCode: 400, res: res });
        } else {
            // save student in Database
            newStudent.save()
                .then(data => {
                    let response = { "status": "ok", "message": "Student saved successfully", "error": false, "data": data };
                    wrapper.sendResponse({ method: "POST /api/student", response: response, httpCode: 202, res: res });
                }).catch(error => {
                    let response = { "status": "error", "message": "Some error occurred while creating the Student", "error": true, "data": error.message || undefined };
                    wrapper.sendResponse({ method: "POST /api/student", response: response, httpCode: 500, res: res });
                });
        }
    }
};

// Retrieve and return all students from the database.
exports.findAll = (req, res) => {
    Student.find()
        .then(students => {
            if (students && students.length > 0) {
                let response = { "status": "ok", "message": "Students queried successfully", "error": false, "data": students };
                wrapper.sendResponse({ method: "GET /api/student", response: response, httpCode: 200, res: res });
            } else {
                let response = { "status": "ok", "message": "no data", "error": false, "data": undefined };
                wrapper.sendResponse({ method: "GET /api/student", response: response, httpCode: 200, res: res });
            }
        }).catch(error => {
            let response = { "status": "error", "message": "Some error occurred while retrieving students", "error": true, "data": error.message || undefined };
            wrapper.sendResponse({ method: "GET /api/student", response: response, httpCode: 500, res: res });
        });
};

// Find a single student with a id
exports.findOne = (req, res) => {
    Student.findById(req.params.id)
        .then(student => {
            if (!student) {
                let response = { "status": "error", "message": "Student not found with id " + req.params.id, "error": true, "data": undefined };
                wrapper.sendResponse({ method: "GET /api/student/" + req.params.id, response: response, httpCode: 404, res: res });
            } else {
                let response = { "status": "ok", "message": "Student queried successfully", "error": false, "data": student };
                wrapper.sendResponse({ method: "GET /api/student/" + req.params.id, response: response, httpCode: 200, res: res });
            }
        }).catch(error => {
            if (error.kind === 'ObjectId') {
                let response = { "status": "error", "message": "Student not found with id " + req.params.id, "error": true, "data": undefined };
                wrapper.sendResponse({ method: "GET /api/student/" + req.params.id, response: response, httpCode: 404, res: res });
            } else {
                let response = { "status": "error", "message": "Error retrieving student with id " + req.params.id, "error": true, "data": error.message || undefined };
                wrapper.sendResponse({ method: "GET /api/student", response: response, httpCode: 500, res: res });
            }
        });
};

// Update a student identified by the id in the request
exports.update = (req, res) => {
    // Validate request
    if (!req.body) {
        let response = { "status": "error", "message": "Student content can not be empty", "error": true, "data": undefined };
        wrapper.wrapper.sendResponse({ method: "POST /api/student", response: response, httpCode: 400, res: res });
    } else {
        // Create a Student
        const studentToUpdate = {
            id: req.body._id,
            name: req.body.name,
            surname: req.body.surname,
            birthdate: req.body.birthdate,
            gender: req.body.gender,
            email: req.body.email
        };

        let validation = isValid(studentToUpdate);
        if (!validation.isValid) {
            let response = { "status": "error", "message": "Student " + validation.propertyInvalid + " is required", "error": true, "data": studentToUpdate };
            wrapper.sendResponse({ method: "PUT /api/student", response: response, httpCode: 400, res: res });
        } else {
            // Find student and update it with the request body
            Student.findByIdAndUpdate(req.body._id, studentToUpdate, { new: true, upsert: true })
                .then(student => {
                    if (!student) {
                        let response = { "status": "error", "message": "Student not found with id " + req.body._id, "error": true, "data": undefined };
                        wrapper.sendResponse({ method: "PUT /api/student", response: response, httpCode: 404, res: res });
                    } else {
                        let response = { "status": "ok", "message": "Student updated successfully", "error": false, "data": student };
                        wrapper.sendResponse({ method: "PUT /api/student", response: response, httpCode: 202, res: res });
                    }
                }).catch(error => {
                    if (error.kind === 'ObjectId') {
                        let response = { "status": "error", "message": "Student not found", "error": true, "data": undefined };
                        wrapper.sendResponse({ method: "PUT /api/student", response: response, httpCode: 404, res: res });
                    } else {
                        let response = { "status": "error", "message": "Some error occurred while updating the student", "error": true, "data": error.message || undefined };
                        wrapper.sendResponse({ method: "PUT /api/student", response: response, httpCode: 500, res: res });
                    }
                });
        }
    }
};

// Delete a student with the specified id in the request
exports.delete = (req, res) => {
    Student.findByIdAndRemove(req.params.id)
        .then(student => {
            if (!student) {
                let response = { "status": "error", "message": "Student not found with id " + req.params.id, "error": true, "data": undefined };
                wrapper.sendResponse({ method: "DELETE /api/student", response: response, httpCode: 404, res: res });
            } else {
                let response = { "status": "ok", "message": "Student deleted successfully", "error": false, "data": undefined };
                wrapper.sendResponse({ method: "DELETE /api/student/" + req.params.id, response: response, httpCode: 202, res: res });
            }
        }).catch(error => {
            if (error.kind === 'ObjectId' || error.name === 'NotFound') {
                let response = { "status": "error", "message": "Student not found", "error": true, "data": undefined };
                wrapper.sendResponse({ method: "DELETE /api/student", response: response, httpCode: 404, res: res });
            } else {
                let response = { "status": "error", "message": "Could not delete student with id " + req.params.id, "error": true, "data": error.message || undefined };
                wrapper.sendResponse({ method: "DELETE /api/student", response: response, httpCode: 500, res: res });
            }
        });
};