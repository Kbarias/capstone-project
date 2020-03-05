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
    requested_times: {
        first_date: { type: Date, required: true },
        first_time: { type: Number, required: true },
        sec_date: { type: Date, required: true },
        sec_time: { type: Number, required: true },
        third_date: { type: Date, required: true },
        third_date: { type: Number, required: true },
    }
});

module.exports = mongoose.model('Request', RequestSchema);