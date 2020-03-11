const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const UserInfo = require('../models/UserInfo');
const passport = require('passport');

const router = express.Router();

//Login Page
router.get('/login', (req, res) => {
    res.render('login');
});

//Register Page
router.get('/register', (req, res) => {
    res.render('register');
});
//Forgot password page
router.get('/recovery', (req, res) => {
    res.render('recovery');
});
//Register Handle
//remember to add asynce
router.post('/register', (req, res) => {

    //Extract from registers form
    const { name, username, email, password, password2 } = req.body;

    let errors = [];
    //Check required fields are filled
    if (!name || !username || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    //Check that passwords match
    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    //Check that password length is greater than 6
    if (password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters' });
    }

    //Check if there are issues from above, if so re-render the registration page but with entered values so user can edit
    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            username,
            email,
            password,
            password2
        });
    } else {
        //Validation passed
        //Check if user already exists
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    //User exists, re-render register page
                    errors.push({ msg: 'Email is already registered' });
                    res.render('register', {
                        errors,
                        name,
                        username,
                        email,
                        password,
                        password2
                    });
                } else {
                    //create new user
                    const newUser = new User({
                        user_name: username,
                        user_pw: password,
                        full_name: name,
                        email: email,
                    });

                    // //create userInfo document for this new user
                    // const userinfo = new UserInfo({
                    //     _id: user.id,
                    // });

                    // Hash password
                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newUser.user_pw, salt, (err, hash) => {
                            if (err) throw err;
                            //set password to hashed
                            newUser.user_pw = hash;

                            //save user to database
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered and can log in!');
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err));
                            //userinfo.save()
                        }))
                }
            });

    }



});


//Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});


//Logout handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

module.exports = router;