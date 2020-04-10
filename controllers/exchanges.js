const express = require('express');
const Merch = require('../models/Merch');
const Book = require('../models/Book');

exports.get_all_exchanges = (req, res) => {
    const books = Merch.find({$and: [ {status:{state:"Available"}} , {is_deleted:{$ne:true}} ] }).populate('book');
    books.exec(function (err, data){
        if(err) throw err;
        res.render('exchange', { id:req.params.id , member: req.params.member, books:data});
    });
};

exports.get_bookshelf = (req, res) => {
    let userid = req.params.id.slice(0,-1)
    const books = Merch.find({$and: [{owner: userid} , {is_deleted:{$ne:true}} ] }).populate('book');
    books.exec(function (err, data){
        if(err) throw err;
        res.render('bookshelf', { id:req.params.id , member: req.params.member, books:data});
    });
};

exports.get_history = (req, res) => {
    res.render('history', { id:req.params.id, member: req.params.member });
};

exports.post_new_book = (req, res) => {
    let userid = req.params.id.slice(0,-1);
    const { isbn, title, author, edition, offer, condition, price} = req.body;
    Book.findOne({$and: [ {isbn:isbn}, {title: { '$regex': new RegExp('^' + title + '$', "i")}} , {edition:edition}]} )
        .then(book => {
            if (!book){
                var new_book = new Book({isbn:isbn , edition: edition, title: title, author: author});
                new_book.save()
                    .then(book => {
                        var new_merch = new Merch({book: new_book._id, owner: userid, condition_desc: condition, cost: price, offered_as: offer, status:{state:'Available'}});
                        new_merch.save()
                            .then(new_posting => {
                                req.flash('success_msg', 'You have successfully posted a book!');
                                res.redirect('/exchange/bookshelf/' + req.params.id +'/' + req.params.member);
                            })
                    })
                    .catch(err => console.log(err));
            }
            else{
                var new_merch = new Merch({book: book._id, owner: userid, condition_desc: condition, cost: price, offered_as: offer, status:{state:'Available'}});
                        new_merch.save()
                            .then(new_posting => {
                                req.flash('success_msg', 'You have successfully posted a book!');
                                res.redirect('/exchange/bookshelf/' + req.params.id +'/' + req.params.member);
                            })
                            .catch(err => console.log(err));
            }
        });
};