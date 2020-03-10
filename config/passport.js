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

                    //match password in database
                    bcrypt.compare(password, user.user_pw, (err, isMatch) => {
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