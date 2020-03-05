const express = require('express');
const Place = require('../models/Place');

const router = express.Router();

//get all places
router.get('/', (req, res) => {
    res.send('These are all the places');
});

//create new place handle
router.post('/', (req,res) => {
    const place = new Place({
        gps_coordinates: {
            latitude: req.body.gps_coordinates.latitude,
            longitude: req.body.gps_coordinates.latitude
        },
        name: req.body.name,
        capacity: req.body.capacity,
        rating: req.body.rating,
        operation_hours: {
            mon: req.body.operation_hours.mon,
            tues: req.body.operation_hours.tues,
            weds: req.body.operation_hours.weds,
            thurs: req.body.operation_hours.thurs,
            fri: req.body.operation_hours.fri,
            sat: req.body.operation_hours.sat,
            sun: req.body.operation_hours.sun
        },
        address: {
            street: req.body.address.street,
            city: req.body.address.city,
            state: req.body.address.state,
            zipcode: req.body.address.zipcode
        }

    });

    place.save()
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.json({ message: err });
        });

});

module.exports = router;