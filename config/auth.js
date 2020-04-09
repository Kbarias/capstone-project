const mongoose = require('mongoose');
const User = require('../models/User');


module.exports = {
    isAdminDashboard: function(req, res, next) {
        let num = req.params.id.length;
        if(req.params.id[num-1] == '1') {
            return next();
        }

        else {
            res.redirect('/dashboard/member/' + req.params.id + '/' + req.params.first_name)
        }

    },

    isAdminInvite: function(req, res, next) {
        if(req.isAuthenticated()) {
            let num = req.params.id.length;
            if(req.params.id[num-1] == '1'){
                return next();
            }
            else{
                res.redirect('/dashboard/member/' + req.params.id + '/' + req.params.first_name)
            }
        }
        req.flash('error_msg', 'Please log in to view this resource');
        res.redirect('/users/login');

    },

    ensureAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()) {
                return next();
        }
        req.flash('error_msg', 'Please log in to view this resource');
        res.redirect('/users/login');

    }

}