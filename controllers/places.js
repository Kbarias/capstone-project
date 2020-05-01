const mongoose = require('mongoose');
const Place = require('../models/Place');
const Comment = require('../models/Comment');
const Geocodio = require('geocodio-library-node');
const geocoder = new Geocodio('77180e0f788715b08e97e9b8985fe01f95b9908');

exports.get_all_places = (req, res) => {
    const places = Place.find({is_verified:true, is_deleted:false});
    places.exec(function (err, data){
        if(err) throw err;
        res.render('wander' , { id:req.params.id, member: req.params.member, places:data });
    });
};

exports.create_a_place = (req, res) => {
    let userid = req.params.id.slice(0,-1);
    const {placename, streetaddress, city, state, zipcode, capacity, rating, website, comment, monday1, monday2, tuesday1, tuesday2, wednesday1, wednesday2, thursday1, thursday2, friday1, friday2, saturday1, saturday2, sunday1, sunday2} = req.body;
    let op_hours = [];
    op_hours.push(monday1, monday2, tuesday1, tuesday2, wednesday1, wednesday2, thursday1, thursday2, friday1, friday2, saturday1, saturday2, sunday1, sunday2);

    geocoder.geocode(streetaddress + "," + city + "," + state + "," + zipcode)
        .then(response => {
            let lat = response.results[0].location.lat;
            let long =response.results[0].location.lng;
            
            //check if place is already in DB
            Place.findOne({'gps_coordinates.latitude':lat, 'gps_coordinates.longitude':long})
                .then(place =>{
                    //if not place found, create a new doc for it
                    if(!place){
                        //turn hours from 24 to 12
                        op_hours.forEach( function (value, index){
                            var time = value.split(':');
                            var hour = (time[0] % 12) || 12;
                        
                            if(time[0]>= 12){
                                op_hours[index] = hour + ":" + time[1] + " " + "PM";
                            }else{
                                op_hours[index] = hour + ":" + time[1] + " " + "AM";
                            }
                        })

                        //if an admin, set is_verified to true
                        if(req.params.id[req.params.id.length -1] == '1'){

                            const newplace = new Place({
                                gps_coordinates: {
                                    latitude: lat,
                                    longitude: long
                                },
                                name: placename,
                                capacity: capacity,
                                website: website,
                                address: {
                                    street: response.results[0].address_components.number + " " + response.results[0].address_components.formatted_street,
                                    city: response.results[0].address_components.city,
                                    state: response.results[0].address_components.state,
                                    zipcode: response.results[0].address_components.zip,
                                    full_address: response.results[0].formatted_address
                                },
                                is_verified: true

                            });
                            if(rating){
                                newplace.rating.num = Number(rating);
                                newplace.rating.people = 1;
                            }
                            //if a comment is being added too
                            if(comment){
                                var newComment = new Comment({place:newplace._id, commentor:userid, text: comment});
                                newComment.save()
                                .then(saved => {
                                    newplace.operation_hours.push(op_hours[0] + " - " + op_hours[1], op_hours[2] + " - " + op_hours[3], op_hours[4] + " - " + op_hours[5], op_hours[6] + " - " + op_hours[7], op_hours[8] + " - " + op_hours[9], op_hours[10] + " - " + op_hours[11], op_hours[12] + " - " + op_hours[13]);
                                    newplace.comments.push(newComment);
                                    newplace.save()
                                    .then(savedplace =>{
                                        req.flash('success_msg', 'You have successfully added a location to Agora.');
                                        res.redirect('/places/' + req.params.id + '/' + req.params.member);
                                    })
                                })
                            }else{ //no comment being added
                                newplace.operation_hours.push(op_hours[0] + " - " + op_hours[1], op_hours[2] + " - " + op_hours[3], op_hours[4] + " - " + op_hours[5], op_hours[6] + " - " + op_hours[7], op_hours[8] + " - " + op_hours[9], op_hours[10] + " - " + op_hours[11], op_hours[12] + " - " + op_hours[13]);
                                newplace.save()
                                .then(savedplace =>{
                                    req.flash('success_msg', 'You have successfully added a location to Agora.');
                                    res.redirect('/places/' + req.params.id + '/' + req.params.member);
                                })
                            }                          
                        }
                        //if not an admin, is_verifed is false
                        else {
                            const newplace = new Place({
                                gps_coordinates: {
                                    latitude: lat,
                                    longitude: long
                                },
                                name: placename,
                                capacity: capacity,
                                website: website,
                                address: {
                                    street: response.results[0].address_components.number + " " + response.results[0].address_components.formatted_street,
                                    city: response.results[0].address_components.city,
                                    state: response.results[0].address_components.state,
                                    zipcode: response.results[0].address_components.zip,
                                    full_address: response.results[0].formatted_address
                                }
                            });
                            if(rating){
                                newplace.rating.num = Number(rating);
                                newplace.rating.people = 1;
                            }
                            if(comment){
                                var newComment = new Comment({place:newplace._id, commentor:userid, text: comment});
                                newComment.save()
                                .then(saved => {
                                    newplace.operation_hours.push(op_hours[0] + " - " + op_hours[1], op_hours[2] + " - " + op_hours[3], op_hours[4] + " - " + op_hours[5], op_hours[6] + " - " + op_hours[7], op_hours[8] + " - " + op_hours[9], op_hours[10] + " - " + op_hours[11], op_hours[12] + " - " + op_hours[13]);
                                    newplace.comments.push(newComment);
                                    newplace.save()
                                    .then(savedplace =>{
                                        req.flash('success_msg', 'You have successfully added a location to Agora. The location has to be approved by an admin before it can be accessed.');
                                        res.redirect('/places/' + req.params.id + '/' + req.params.member);
                                    })
                                })
                            }else{ //no comment being added
                                newplace.operation_hours.push(op_hours[0] + " - " + op_hours[1], op_hours[2] + " - " + op_hours[3], op_hours[4] + " - " + op_hours[5], op_hours[6] + " - " + op_hours[7], op_hours[8] + " - " + op_hours[9], op_hours[10] + " - " + op_hours[11], op_hours[12] + " - " + op_hours[13]);
                                newplace.save()
                                .then(savedplace =>{
                                    req.flash('success_msg', 'You have successfully added a location to Agora.');
                                    res.redirect('/places/' + req.params.id + '/' + req.params.member);
                                })
                            } 

                        } 
                    }
                    else {
                        console.log(req.params.id[-1]);
                        if(req.params.id[-1] == 1){
                            console.log('im an admine');
                        }
                        req.flash('error_msg', 'This location was already added. Please enter a new location.');
                        res.redirect('/places/wander-add/' + req.params.id + '/' + req.params.member);
                    }
                })
        })
        .catch(err => {
            console.error(err);
        });
};

exports.get_place_detail = (req, res) => {
    Place.findOne({_id:req.params.placeid}).populate('comments').populate({path: 'comments', populate: { path: 'commentor', model:'User'}})
        .then(place => {
            res.render('wander-detail', { id:req.params.id, member: req.params.member, place:place});
        })
};

exports.get_add_new_place_page = (req, res) => {
    res.render('wander-add', { id:req.params.id, member: req.params.member});
};

exports.get_manage_locations_page = (req, res) => {
    const places = Place.find({is_verified:false, is_deleted:false})
    places.exec(function (err, data){
        if(err) throw err;
        Place.findOne({_id:req.params.placeid})
            .then(place => {
                res.render('manage-location' , { id:req.params.id, member: req.params.member, places:data, place:place });
            })
    });
};

exports.edit_place = (req, res) => {
    let userid = req.params.id.slice(0,-1);
    const {rating, comment, monday1, monday2, tuesday1, tuesday2, wednesday1, wednesday2, thursday1, thursday2, friday1, friday2, saturday1, saturday2, sunday1, sunday2} = req.body;
    let op_hours = [];
    op_hours.push(monday1, monday2, tuesday1, tuesday2, wednesday1, wednesday2, thursday1, thursday2, friday1, friday2, saturday1, saturday2, sunday1, sunday2);

    // No edits made
    if((!rating) && (!comment) && (!op_hours[0]) && (!op_hours[1]) && (!op_hours[2]) && (!op_hours[3]) && (!op_hours[4]) && (!op_hours[5]) && (!op_hours[6]) ){
        req.flash('error_msg', 'You did not make any edits.');
        res.redirect('/places/wander-detail/' + req.params.id + '/' + req.params.member + '/' + req.params.placeid);
    }

    //just adding a rating or comment
    else if((!op_hours[0]) && (!op_hours[1]) && (!op_hours[2]) && (!op_hours[3]) && (!op_hours[4]) && (!op_hours[5]) && (!op_hours[6]) ){
        Place.findOne({_id:req.params.placeid})
            .then(edit_rating => {
                var new_rating = Number(edit_rating.rating.num);
                var new_people = Number(edit_rating.rating.people);
                if(rating){
                    new_people = Number(new_people + 1);
                    new_rating = Number(Number(edit_rating.rating.num) + Number(rating)) / Number(new_people);
                }
                if(comment){
                    var newComment = new Comment({place:req.params.placeid, commentor:userid, text: comment});
                    newComment.save()
                    .then(saved_comment => {
                        Place.findOneAndUpdate({_id:req.params.placeid}, {'rating.num' : Number(new_rating), 'rating.people': Number(new_people), $push:{comments: newComment}})
                            .then(donee =>{
                                req.flash('success_msg', 'You have successfully submitted a review.');
                                res.redirect('/places/' + req.params.id + '/' + req.params.member);
                            })
                    })
                }else{
                    Place.findOneAndUpdate({_id:req.params.placeid}, {'rating.num': new_rating, 'rating.people': new_people})
                    .then(donee =>{
                        req.flash('success_msg', 'You have successfully submitted a review.');
                        res.redirect('/places/' + req.params.id + '/' + req.params.member);
                    })
                }
            })
    }
    else {
        //editing the operation hours
        Place.findOne({_id:req.params.placeid})
        .then(existing_place => {

            let new_hours = [];
            for(var i = 0; i < existing_place.operation_hours.length; i++){
                new_hours.push(existing_place.operation_hours[i]);
            }
            //turn hours from 24 to 12
            op_hours.forEach( function (value, index){
                if(index % 2 == 0 && (value != '')){
                    var time = value.split(':'); var hour = (time[0] % 12) || 12;

                    var time2 = op_hours[index + 1].split(':'); var hour2 = (time2[0] % 12) || 12;
                    if(time[0]>= 12){
                        new_hours[Math.floor(index/2)] = hour + ":" + time[1] + " " + "PM";
                        if(time2[0]>= 12){
                            new_hours[Math.floor(index/2)] = new_hours[Math.floor(index/2)] + ' - ' + hour2 + ":" + time2[1] + " " + "PM";
                        }
                        else{
                            new_hours[Math.floor(index/2)] = new_hours[Math.floor(index/2)] + ' - ' + hour2 + ":" + time2[1] + " " + "AM";
                        }
                    }
                    else{
                        new_hours[Math.floor(index/2)] = hour + ":" + time[1] + " " + "AM";
                        if(time2[0]>= 12){
                            new_hours[Math.floor(index/2)] = new_hours[Math.floor(index/2)] + ' - ' + hour2 + ":" + time2[1] + " " + "PM";
                        }
                        else{
                            new_hours[Math.floor(index/2)] = new_hours[Math.floor(index/2)] + ' - ' + hour2 + ":" + time2[1] + " " + "AM";
                        }
                    }
                }
            })
            var new_rating = Number(edit_rating.rating.num);
            var new_people = Number(edit_rating.rating.people);
            if(rating){
                new_people = Number(new_people + 1);
                new_rating = Number(Number(edit_rating.rating.num) + Number(rating)) / Number(new_people);
            }
            if(comment){
                var newComment = new Comment({place:req.params.placeid, commentor:userid, text: comment});
                newComment.save()
                    .then(saved_comment => {
                        Place.findOneAndUpdate({_id:req.params.placeid}, {'rating.num': Number(new_rating), 'rating.people': Number(new_people), $push:{comments: newComment}})
                            .then(donee =>{
                                req.flash('success_msg', 'You have successfully submitted an edit to this location. It will be reviewed by an Agora admin.');
                                res.redirect('/places/' + req.params.id + '/' + req.params.member);
                            })
                    })
            }else{
                Place.findOneAndUpdate({_id:req.params.placeid}, {'rating.num': Number(new_rating), 'rating.people': Number(new_people)})
                    .then(donee =>{
                        req.flash('success_msg', 'You have successfully submitted an edit to this location. It will be reviewed by an Agora admin.');
                        res.redirect('/places/' + req.params.id + '/' + req.params.member);
                    })
            }
        })
    }
};

exports.reject_place = (req, res) => {
    Place.findOneAndUpdate({_id:req.params.placeid}, {is_deleted:true})
    .then(rejecting => {
        req.flash('success_msg', 'You have successfully rejected ' + rejecting.name);
        res.redirect('/places/manage-location/' + req.params.id + '/' + req.params.member);
    })
};

exports.verify_place = (req, res) => {
    const {placename, streetaddress, city, state, zipcode, capacity, website, monday1, monday2, tuesday1, tuesday2, wednesday1, wednesday2, thursday1, thursday2, friday1, friday2, saturday1, saturday2, sunday1, sunday2} = req.body;
    let op_hours = [];
    op_hours.push(monday1, monday2, tuesday1, tuesday2, wednesday1, wednesday2, thursday1, thursday2, friday1, friday2, saturday1, saturday2, sunday1, sunday2);

    Place.findOne({_id:req.params.placeid})
        .then(existing_place => {
            let new_hours = [];
            for(var i = 0; i < existing_place.operation_hours.length; i++){
                new_hours.push(existing_place.operation_hours[i]);
            }
            //turn hours from 24 to 12
            op_hours.forEach( function (value, index){
                if(index % 2 == 0 && (value != '')){
                    var time = value.split(':'); var hour = (time[0] % 12) || 12;

                    var time2 = op_hours[index + 1].split(':'); var hour2 = (time2[0] % 12) || 12;
                    if(time[0]>= 12){
                        new_hours[Math.floor(index/2)] = hour + ":" + time[1] + " " + "PM";
                        if(time2[0]>= 12){
                            new_hours[Math.floor(index/2)] = new_hours[Math.floor(index/2)] + ' - ' + hour2 + ":" + time2[1] + " " + "PM";
                        }
                        else{
                            new_hours[Math.floor(index/2)] = new_hours[Math.floor(index/2)] + ' - ' + hour2 + ":" + time2[1] + " " + "AM";
                        }
                    }
                    else{
                        new_hours[Math.floor(index/2)] = hour + ":" + time[1] + " " + "AM";
                        if(time2[0]>= 12){
                            new_hours[Math.floor(index/2)] = new_hours[Math.floor(index/2)] + ' - ' + hour2 + ":" + time2[1] + " " + "PM";
                        }
                        else{
                            new_hours[Math.floor(index/2)] = new_hours[Math.floor(index/2)] + ' - ' + hour2 + ":" + time2[1] + " " + "AM";
                        }
                    }
                }
            })

            //incase the admin changed the address, such for it to get the lat and long
            geocoder.geocode(streetaddress + "," + city + "," + state + "," + zipcode)
                .then(response => {
                    let lat = response.results[0].location.lat;
                    let long =response.results[0].location.lng;
                    
                        //find the unverified place doc, and update with the entered data by the admin
                    Place.findOneAndUpdate({_id:req.params.placeid}, {'gps_coordinates.latitude':lat, 'gps_coordinates.longitude': long, name:placename, 
                        capacity: capacity, website: website, 'address.street': (response.results[0].address_components.number 
                        + " " + response.results[0].address_components.formatted_street), 'address.city':(response.results[0].address_components.city), 
                        'address.state':(response.results[0].address_components.state), 'address.zipcode':(response.results[0].address_components.zip), 
                        'address.full_address': (response.results[0].formatted_address), operation_hours:new_hours, is_verified: true})
                        .then(place =>{
                            req.flash('success_msg', 'You have successfully added location to Agora.');
                            res.redirect('/places/manage-location/' + req.params.id + '/' + req.params.member);

                        })

                })
                .catch(err => {
                    console.error(err);
                });
        })
};

// exports.location_review = (req, res) => {
//     res.render('location-review', {id:req.params.id, member: req.params.member });
// };