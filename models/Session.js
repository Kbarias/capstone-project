const mongoose = require('mongoose');

const SessionSchema = mongoose.Schema({
    place: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place',
        required: true
    },
    organizers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    name: {
        type: String,
        required: true
    },
    is_tutoring: Boolean,
    capacity: {
        type: Number,
        required: true
    },
    time: {
        start: {type: String, required: true},
        end: {type: String, required: true}
    },
    date:{
        type: String,
        required: true
    },
    description: {
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