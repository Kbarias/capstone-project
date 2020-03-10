const mongoose = require('mongoose');

const SessionSchema = mongoose.Schema({
    place: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    is_public: {
        type: Boolean,
        required: true
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Session', SessionSchema);