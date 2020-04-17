const express = require('express');
const Merch = require('../models/Merch');
const Book = require('../models/Book');
const Exchange = require('../models/Exchange');
const UserInfo = require('../models/UserInfo');
const Place = require('../models/Place');

exports.get_all_exchanges = (req, res) => {
    const books = Merch.find({$and: [ {status:{state:"Available"}} , {is_deleted:{$ne:true}} ] }).populate('book');
    books.exec(function (err, data){
        if(err) throw err;
        res.render('exchange', { id:req.params.id , member: req.params.member, books:data});
    });
};

exports.get_my_bookshelf = (req, res) => {
    let userid = req.params.id.slice(0,-1);
    const renting = Exchange.find({$and: [ {buyer: userid} , {status:{state:"Renting"}} ] }).populate('user');
    renting.exec(function (err, data){
        if(err) throw err;
        res.render('bookshelf', { id:req.params.id , member: req.params.member, books:data});
    });
};

exports.get_my_postings = (req, res) => {
    let userid = req.params.id.slice(0,-1);
    const books = Merch.find({$and: [{owner: userid} , {is_deleted:{$ne:true}} ] }).populate('book');
    const places = Place.find({$and: [{is_verified: true} , {is_deleted:false} ] });
    
    places.exec(function (err, place) {
        books.exec(function (err, data){
            if(err) throw err;
            res.render('postings', { id:req.params.id , member: req.params.member, books:data, places:place});
        });
    });

};

exports.get_history = (req, res) => {
    res.render('history', { id:req.params.id, member: req.params.member });
};

exports.post_new_book = (req, res) => {
    let userid = req.params.id.slice(0,-1);
    const { isbn, title, author, edition, offer, condition, price, first, second, third} = req.body;
    res.send(isbn + " " + title + " " + author + " " + edition + " " + offer + " " + condition + " " + price + " " + first + second + third);

    // Book.findOne({$and: [ {isbn:isbn}, {title: { '$regex': new RegExp('^' + title + '$', "i")}} , {edition:edition}]} )
    //     .then(book => {
    //         if (!book){
    //             //create new book entry
    //             var new_book = new Book({isbn:isbn , edition: edition, title: title, author: author});
    //             new_book.save()
    //                 .then(book => {
    //                     //create a merch entry for user
    //                     var new_merch = new Merch({book: new_book._id, owner: userid, condition_desc: condition, cost: price, offered_as: offer, status:{state:'Available'}});
    //                     new_merch.save()
    //                         .then(new_posting => {
    //                             req.flash('success_msg', 'You have successfully posted a book!');
    //                             res.redirect('/exchange/postings/' + req.params.id +'/' + req.params.member);
    //                         })
    //                 })
    //                 .catch(err => console.log(err));
    //         }
    //         else{
    //             //if the book was found, create a new merch entry for user
    //             var new_merch = new Merch({book: book._id, owner: userid, condition_desc: condition, cost: price, offered_as: offer, status:{state:'Available'}});
    //                     new_merch.save()
    //                         .then(new_posting => {
    //                             req.flash('success_msg', 'You have successfully posted a book!');
    //                             res.redirect('/exchange/postings/' + req.params.id +'/' + req.params.member);
    //                         })
    //                         .catch(err => console.log(err));
    //         }
    //     });
};

exports.get_textbook_details = (req, res) => {
    Merch.findOne({_id:req.params.merchid}).populate('book').populate('owner')
    .then(merch => {
        UserInfo.findOne({_id: merch.owner})
            .then(userinfo=> {
                res.render('textbook-details', { id:req.params.id, member: req.params.member, merch:merch, rating:userinfo.rating});
            })
    })
};

exports.get_textbook_owner = (req, res) => {
    Merch.findOne({_id:req.params.merchid}).populate('book').populate('owner')
        .then(merch => {
            UserInfo.findOne({_id: merch.owner})
                .then(userinfo=> {
                    res.render('textbook-owner-details', { id:req.params.id, member: req.params.member, merch:merch, rating:userinfo.rating});
                })
        })
};

exports.post_request = (req, res) => {
    const { start, end, pickup } = req.body;
    var d1 = Date.parse(start);
    var d2 = Date.parse(end);
    if(d2 > d1){
        console.log(d1);
    }
    res.send(start + " " + end + " " + pickup);
};