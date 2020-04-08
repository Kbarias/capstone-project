const express = require('express');
const Merch = require('../models/Merch');

exports.get_all_exchanges = (req, res) => {
    const books = Merch.find({$and: [ {status:{state:"Available"}} , {is_deleted:{$ne:true}} ] }).populate('book');
    books.exec(function (err, data){
        if(err) throw err;
        res.render('exchange', { id:req.params.id , member: req.params.member, books:data});
    });
};