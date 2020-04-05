const express = require('express');
const { ensureAuthenticated } = require('../config/auth');
const User = require('../models/User');

exports.get_all_exchanges = (req, res) => {
    res.render('exchange', { id:req.params.id, member: req.params.member});
};