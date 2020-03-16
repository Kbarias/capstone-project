const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/User');

module.exports = function(passport){
    passport.use(
        new LocalStrategy({ usernameField: 'email'}, (email, password, done) => {
            //Match user
            User.findOne({ email: email})
                .then(user => {
                    //if no match
                    if(!user){
                        return done(null, false, {message: 'That email is not registered'});
                    }

                    //if user email is not verified
                    if(!user.is_verified){
                        return done(null, false, {message: 'Please verify your email to login'});
                    }

                    //match password in database
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if(err) throw err;

                        if(isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, {message: 'Password incorrect'});
                        }
                    });
                })
                .catch(err => console.log(err));
        })
    );

    passport.serializeUser( (user, done) => {
        done(null, user.id);
    });
    
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
          done(err, user);
        });
    });
}