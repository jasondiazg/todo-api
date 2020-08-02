const mongoose = require('mongoose');

const TodoSchema = mongoose.Schema({
    description: String,
    done: Boolean,
    idUser: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Todo', TodoSchema);