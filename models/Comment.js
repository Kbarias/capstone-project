const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
    place: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place'
    },
    commentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    time: { 
        type: Date,
        default: Date.now()
    },
    text: {
        type: String,
        required: true
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Comment', CommentSchema);