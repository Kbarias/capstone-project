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
    offer: {
        type: String,
        required: true
    },
    place: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place',
        required: true
    },
    meeting_date: {
        type: String,
        required: true
    },
    meet_time: {
        type: String,
        required: true
    },
    status: {
        state: { type: String, required: true },
        rent_info: {
            start_date: String,
            return_date: String,
            days_late: {type : Number, default: 0},
            place: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Place'
            }
        },
        purchase_date: String
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Exchange', ExchangeSchema);