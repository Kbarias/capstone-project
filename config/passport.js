const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/User');
const UserInfo = require('../models/UserInfo');

module.exports = function(passport){
    passport.use(
        new LocalStrategy({ usernameField: 'email'}, (email, password, done) => {
            //Match user
            User.findOne({ email: email, is_deleted:false})
                .then(user => {
                    //if no match
                    if(!user){
                        return done(null, false, {message: 'That email is not registered'});
                    }

                    //if user email is not verified
                    if(!user.is_verified){
                        return done(null, false, {message: 'Please verify your email to login. Check your email.'});
                    }

                    UserInfo.findOne({_id:user._id})
                        .then(userinfo => {
                            //if user email is not verified
                            if(userinfo.account_status == 'Blocked'){
                                return done(null, false, {message: 'Your account has been blocked. Check your email for a message from an administrator.'});
                            }
                            else{
                                //match password in database
                                bcrypt.compare(password, user.password, (err, isMatch) => {
                                    if(err) throw err;

                                    if(isMatch) {
                                        return done(null, user);
                                    } else {
                                        return done(null, false, {message: 'Password incorrect'});
                                    }
                                });
                            }
                        })


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