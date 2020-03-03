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
        status_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Status'}
    },
    suggested_places: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place',
        maxItems: 3
    }]
});

module.exports = mongoose.model('Merch', MerchSchema);