const mongoose = require('mongoose');

const BookSchema = mongoose.Schema({
    isbn_nums: [{
        type: Number,
        required: true
    }],
    name: {
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