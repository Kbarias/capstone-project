const mongoose = require('mongoose');

const PlaceSchema = mongoose.Schema({
    gps_coordinates: {
        latitude: { type: Number, required: true},
        longitude: { type: Number, required: true}
    },
    name: { type: String, required: true},
    capacity: Number,
    rating: Number,
    operation_hours: {
        mon: { type: String, required: true},
        tues: { type: String, required: true},
        weds: { type: String, required: true},
        thurs: { type: String, required: true},
        fri: { type: String, required: true},
        sat: { type: String, required: true},
        sun: { type: String, required: true}
    },
    address: {
        street: { type: String, required: true},
        city: { type: String, required: true},
        state: { type: String, required: true},
        zipcode: { type: String, required: true}
    }
});

module.exports = mongoose.model('Place', PlaceSchema);