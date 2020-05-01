const mongoose = require('mongoose');

const PlaceSchema = mongoose.Schema({
    gps_coordinates: {
        latitude: { type: Number, required: true},
        longitude: { type: Number, required: true}
    },
    name: { type: String, required: true},
    capacity: Number,
    rating: Number,
    website: String,
    description: String,
    operation_hours: [{
        type: String,
        maxItems: 7,
    }],
    address: {
        street: { type: String, required: true},
        city: { type: String, required: true},
        state: { type: String, required: true},
        zipcode: { type: String, required: true},
        full_address: { type: String, required: true}
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    is_verified: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Place', PlaceSchema);