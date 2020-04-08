const mongoose = require('mongoose');
const Place = require('../models/Place');

exports.get_all_places = (req, res) => {
    const places = Place.find({$and: [ {is_verified:true} , {is_deleted:false} ] });
    places.exec(function (err, data){
        if(err) throw err;
        res.render('places' , { id:req.params.id, member: req.params.member, places:data });
    });
};

exports.create_a_place = (req, res) => {
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


    try {
        const savedPlace = place.save();
        res.json(savedPlace);
    } catch (err) {
        res.json( {message:err} );
    }
};