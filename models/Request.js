const mongoose = require('mongoose');

const RequestSchema = mongoose.Schema({
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    merch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Merch',
        required: true,
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    place: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    message: String,
    requested_times: {
        first_date: { type: String, required: true },
        first_time: { type: String, required: true },
        sec_date: { type: String, required: true },
        sec_time: { type: String, required: true },
        third_date: { type: String, required: true },
        third_time: { type: String, required: true },
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Request', RequestSchema);