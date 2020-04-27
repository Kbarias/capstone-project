const mongoose = require('mongoose');
const express = require('express');
const Merch = require('../models/Merch');
const Book = require('../models/Book');
const Exchange = require('../models/Exchange');
const UserInfo = require('../models/UserInfo');
const Place = require('../models/Place');
const Request = require('../models/Request');
const nodemailer = require('nodemailer');

//NODEMAILER CONFIG
var transporter = nodemailer.createTransport({ 
    service: 'gmail', 
    auth: { 
        user: 'TheAgoraProject1@gmail.com', 
        pass: 'vr0gVBroj3ct' 
    } 
});

var mailOptions = { 
    from: 'TheAgoraProject1@gmail.com', 
    to: '', 
    subject: 'Account Verification Token', 
    text: '' 
};


exports.get_all_exchanges = (req, res) => {
    const books = Merch.find({$and: [ {'status.state':"Available"} , {is_deleted:{$ne:true}} ] }).populate('book');
    books.exec(function (err, data){
        if(err) throw err;
        res.render('exchange', { id:req.params.id , member: req.params.member, books:data});
    });
};

exports.get_my_bookshelf = (req, res) => {
    let userid = req.params.id.slice(0,-1);
    const renting = Exchange.find({$and: [ {buyer: userid} , {'status.state':"Renting"} ] }).populate('book').populate('owner').populate('status.rent_info.place');
    renting.exec(function (err, data){
        if(err) throw err;
        res.render('bookshelf', { id:req.params.id , member: req.params.member, books:data});
    });
};

exports.get_post_a_book_page = (req, res) => {
    let userid = req.params.id.slice(0,-1);
    const places = Place.find({$and: [{is_verified: true} , {is_deleted:false} ] });
    
    places.exec(function (err, place) {
        res.render('postbook', { id:req.params.id , member: req.params.member, places:place});
    });

};

exports.delete_book_post = (req, res) => {
    let userid = req.params.id.slice(0,-1);
    //find the merch posting and delete it, find all requests and send email saying no longer available
    Promise.all([
        Merch.findOneAndUpdate({_id:merchid, owner:userid}, {is_deleted:true}),
        Request.updateMany({merch:merchid, is_deleted:false}, {is_deleted:true})
    ])
    .then(results => {
        const [the_merch, requests] = results;

    })
};

exports.post_new_book = (req, res) => {
    let userid = req.params.id.slice(0,-1);
    const { isbn, title, author, edition, offer, condition, price, weeks, first, second, third} = req.body;

    let week_input = weeks;

    if(offer == 'To Donate' || offer == 'For Sale'){
        week_input = null;
    }

    Promise.all([
        //get place ids from DB
        Place.findOne({'address.full_address':(first.split(':')[1].trim())}),
        Place.findOne({'address.full_address':(second.split(':')[1].trim())}),
        Place.findOne({'address.full_address':(third.split(':')[1].trim())}),
    ])
    .then(results =>{
        const [placeone ,placetwo, placethree] = results;
        //search if the book entry already exists in DB
        Book.findOne({$and: [ {isbn:isbn}, {title: { '$regex': new RegExp('^' + title + '$', "i")}} , {edition:edition}]} )
        .then(book => {
            if (!book){
                //create new book entry
                var new_book = new Book({isbn:isbn , edition: edition, title: title, author: author});
                new_book.save()
                    .then(book => {
                        //create a merch entry for user
                        var new_merch = new Merch({book: new_book._id, owner: userid, condition_desc: condition, cost: price, offered_as: offer, status:{state:'Available'}, availability_period: week_input});
                        new_merch.suggested_places.push(placeone._id, placetwo._id, placethree._id);
                        new_merch.save()
                            .then(new_posting => {
                                req.flash('success_msg', 'You have successfully posted a book!');
                                res.redirect('/exchange/myposts/' + req.params.id +'/' + req.params.member);
                            })
                    })
                    .catch(err => console.log(err));
            }
            else{
                //if the book was found, create a new merch entry for user
                var new_merch = new Merch({book: book._id, owner: userid, condition_desc: condition, cost: price, offered_as: offer, status:{state:'Available'}, availability_period: week_input});
                new_merch.suggested_places.push(placeone._id, placetwo._id, placethree._id);
                new_merch.save()
                    .then(new_posting => {
                        req.flash('success_msg', 'You have successfully posted a book!');
                        res.redirect('/exchange/myposts/' + req.params.id +'/' + req.params.member);
                    })
                    .catch(err => console.log(err));
            }
        });
    })

};

exports.get_myposts = (req, res) => {
    let userid = req.params.id.slice(0,-1);
    const books = Merch.find({$and: [{owner: userid} , {is_deleted:{$ne:true}} ] }).populate('book');

    books.exec(function (err, data){
        if(err) throw err;
        res.render('myposts', { id:req.params.id , member: req.params.member, books:data});
    });
};

exports.get_history = (req, res) => {
    let userid = req.params.id.slice(0,-1);
    Promise.all([
        Request.find({requester:userid, is_deleted:false}).populate('book').populate('owner'),
        Exchange.find({owner:userid}).populate('book').populate('buyer'),
        Exchange.find({buyer:userid}).populate('book').populate('buyer').populate('owner')
    ])
    .then(myhistory =>{
        //my_requests: outgoing requests I have made, sold: transactions where i have been the seller, bought: transactions where I have been the buyer
        const [my_requests, sold, bought] = myhistory;
        res.render('history', { id:req.params.id, member: req.params.member, requests:my_requests, sold_books:sold, bought_books:bought });
    })
};

exports.get_textbook_details = (req, res) => {
    Merch.findOne({_id:req.params.merchid}).populate('book').populate('owner').populate('suggested_places')
    .then(merch => {
        UserInfo.findOne({_id: merch.owner})
            .then(userinfo=> {
                res.render('textbook-details', { id:req.params.id, member: req.params.member, merch:merch, rating:userinfo.rating, places:merch.suggested_places});
            })
    })
};

exports.owner_get_textbook = (req, res) => {
    let userid = req.params.id.slice(0,-1);
    Promise.all([
        Merch.findOne({_id:req.params.merchid, is_deleted:false}).populate('book').populate('owner'),
        Request.find({merch:req.params.merchid, status:'Pending', is_deleted:false}).populate('requester').populate('place')
    ])
    .then(results => {
        const [merch, requests] = results;
        UserInfo.findOne({_id: userid})
            .then(userinfo=> {
                res.render('textbook-owner-details', { id:req.params.id, member: req.params.member, merch:merch, rating:userinfo.rating, requests:requests});
            })
    })
};

exports.post_request = (req, res) => {
    let userid = req.params.id.slice(0,-1);
    const { message, first, first_date, first_time, sec_date, sec_time, third_date, third_time } = req.body;
    let choices = [];
    choices.push(first_date, first_time, sec_date, sec_time, third_date, third_time);
    choices.forEach( function (value, index){
        if(index % 2 == !0){
            var time = value.split(':');
            var hour = (time[0] % 12) || 12;
        
            if(time[0]>= 12){
                choices[index] = hour + ":" + time[1] + " " + "PM";
            }
            else{
                choices[index] = hour + ":" + time[1] + " " + "AM";
            }
        }
    })
    Promise.all([
        Place.findOne({'address.full_address':first.split(':')[1].trim()}),
        Merch.findOne({_id:req.params.merchid}).populate('book').populate('owner')
    ])
    .then(results =>{
        const [place, merch]= results;
        console.log(place + " " + merch);
        //check to make sure that the exact request doesn't exist already (same merch, same requester)
        Request.findOne({merch:req.params.merchid, requester: userid, is_deleted:false, place:place, 'requested_times.first_date':choices[0], 'requested_times.first_time':choices[1], 'requested_times.sec_date':choices[2], 'requested_times.sec_time':choices[3], 'requested_times.third_date':choices[4], 'requested_times.third_time':choices[5]})
        .then(oldrequest =>{
            if(!oldrequest){
                var new_request = new Request({
                    requester: userid,
                    owner: merch.owner,
                    merch: merch._id,
                    book: merch.book,
                    place: place,
                    message: message,
                    status: 'Pending',
                    date: new Date(),
                    requested_times: {
                        first_date: choices[0],
                        first_time: choices[1],
                        sec_date: choices[2],
                        sec_time: choices[3],
                        third_date: choices[4],
                        third_time: choices[5],
                    }
                });
                new_request.save(request => {
                    req.flash('success_msg', 'You have successfully submitted a request for ' + merch.book.title + 'offered by ' + merch.owner.username);
                    res.redirect('/exchange/history/' + req.params.id +'/' + req.params.member);
                })
                console.log(new_request.date.getMonth() + '/' + new_request.date.getDay() + '/' + new_request.date.getFullYear());
            }
            else{
                req.flash('error_msg', 'You already have an existing request.');
                res.redirect('/exchange/' + req.params.id +'/' + req.params.member);
            }
        })
    })

};

exports.accept_request = (req, res) => {
    
    let userid = req.params.id.slice(0,-1);
    const {accept, message, ID} = req.body;
    
    Promise.all([
        Request.findOne({_id:ID}).populate('requester').populate('merch').populate('book').populate('owner').populate('place'),
        Merch.findOne({_id:req.params.merchid}),
        Request.updateMany({ _id:{$ne:ID}, merch:req.params.merchid, is_deleted:false}, { status: 'Denied' }),
        Request.updateOne({_id:ID}, {status:'Accepted'})
    ])
    .then(results => {
       
        const [request_info, merch, updates] = results;

        let start = null;
        let end = null;
        let the_state = null;

        if(request_info.merch.offered_as == 'For Rent'){
            let days = request_info.merch.availability_period * 7;
            let mydate = new Date(accept.split(' ')[1]);
            start = new Date(accept.split(' ')[1]);
            start = start.toISOString().split('T')[0];
            mydate.setDate(mydate.getDate() + days);
           
            end = mydate.toISOString().split('T')[0];

            the_state = 'Being Rented';
        }

        if(request_info.merch.offered_as == 'For Sale'){
            the_state = 'Sold';
        }

        if(request_info.merch.offered_as == 'To Donate'){
            the_state = 'Donated';

        }

        var newExchange = new Exchange({
            book: request_info.book,
            owner: userid,
            buyer: request_info.requester._id,
            merch: req.params.merchid,
            offer: request_info.merch.offered_as,
            place: request_info.place._id,
            meeting_date: accept.split(' ')[1],
            meet_time: accept.split(' ')[2] + accept.split(' ')[3],
            status: {
                state: the_state,
                rent_info: {
                    start_date: start,
                    return_date: end,
                    place: request_info.place,
                },
                purchase_date: start
            }     
        });

        newExchange.save()
            .then(saved_ex => {
                
                merch.status.state = the_state;
                merch.status.exchange_id = newExchange._id;
                merch.save()
                    .then(saved_merch => {
                        // res.send(newExchange);
                        mailOptions.to = request_info.requester.email;
                        mailOptions.subject = 'Your book request has been accepted!';
                        mailOptions.text = 'Hello,\n\n' + 'Your recent request for '+ request_info.book.title + ' being offered by ' + request_info.owner.username + 
                                ' has been accepted. Your meeting date is ' + newExchange.meeting_date + ' at ' + newExchange.meet_time + '. Your meeting location is ' + request_info.place.address.full_address + '. You can look at your My History page on Agora for these details.';
                        transporter.sendMail(mailOptions, function (err) {
                            if(err) { 
                                console.log(err);
                            }
                        });

                        req.flash('success_msg', 'You accepted ' + request_info.requester.username + "'s request.");
                        res.redirect('/exchange/history/' + req.params.id + '/' + req.params.member);
                    })
            })

    });

};

exports.delete_request = (req, res) => {
    Request.findOne({_id:req.params.requestid}).populate('owner').populate('book')
        .then(request => {
            request.is_deleted = true;
            request.save(saved_req =>{
                req.flash('success_msg', 'You have successfully deleted your request for ' + request.book.title + ' offered by ' + request.owner.username);
                res.redirect('/exchange/history/' + req.params.id +'/' + req.params.member);
            })
        })
};