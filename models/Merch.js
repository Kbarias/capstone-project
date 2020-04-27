const mongoose = require('mongoose');

const MerchSchema = mongoose.Schema({
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
    condition_desc: { 
        type: String,
        required: true
    },
    cost: { 
        type: Number,
        required: true
    },
    offered_as: {
        type: String,
        required: true
    },
    status: {
        state: { type: String, required: true},
        exchange_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Exchange'}
    },
    availability_period: Number,
    suggested_places: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place',
        maxItems: 3
    }],
    is_deleted: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Merch', MerchSchema);