const mongoose = require('mongoose');

const ExchangeSchema = mongoose.Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    merch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Merch',
        required: true
    },
    place: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place',
        required: true
    },
    meeting_date: {
        type: Date,
        required: true
    },
    meet_time: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        state: { type: String, required: true },
        status_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Status', required: true}
    }
});

module.exports = mongoose.model('Exchange', ExchangeSchema);