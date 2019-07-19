const mongoose = require('mongoose');

const StudentSchema = mongoose.Schema({
    name: String,
    surname: String,
    birthdate: Date,
    gender: String,
    email: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Student', StudentSchema);