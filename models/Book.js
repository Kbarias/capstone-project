const mongoose = require('mongoose');

const BookSchema = mongoose.Schema({
    isbn: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    author: { 
        type: String,
        required: true
    },
    subjects: [{
        type: String,
        required: true
    }],
    is_deleted: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Book', BookSchema);