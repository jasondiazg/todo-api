module.exports = (app) => {
    const students = require('../controllers/student.controller.js');

    // Retrieve Student metadata
    app.get('/api/student/metadata', students.metadata);

    // Retrieve all students
    app.get('/api/student', students.findAll);

    // Retrieve a single Student with id
    app.get('/api/student/:id', students.findOne);

    // Create a new Student
    app.post('/api/student', students.create);

    // Update a Student
    app.put('/api/student', students.update);

    // Delete a Student with id
    app.delete('/api/student/:id', students.delete);
}