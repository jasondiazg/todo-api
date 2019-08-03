const studentRoutes = require('../routes/student.routes');
const userRoutes = require('../routes/user.routes');
const authRoutes = require('../routes/auth.routes');

const backend = {
    exposeRoutes: (app) => {
        authRoutes(app);
        studentRoutes(app);
        userRoutes(app);
    }
} 

module.exports = backend;