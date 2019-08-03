module.exports = (app) => {
    const students = require('../controllers/student.controller');
    const verifyToken = require('../auth/verifyToken');

    // Retrieve Student metadata
    app.get('/api/student/metadata', verifyToken, students.metadata);

    // Retrieve all students
    app.get('/api/student', verifyToken, students.findAll);

    // Retrieve a single Student with id
    app.get('/api/student/:id', verifyToken, students.findOne);

    // Create a new Student
    app.post('/api/student', verifyToken, students.create);

    // Update a Student
    app.put('/api/student', verifyToken, students.update);

    // Delete a Student with id
    app.delete('/api/student/:id', verifyToken, students.delete);
}