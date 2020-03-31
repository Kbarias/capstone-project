const bcrypt = require('bcrypt');
const User = require('../models/User');
const UserInfo = require('../models/UserInfo');
const passport = require('passport');
const crypto =  require('crypto');
const nodemailer = require('nodemailer');
const Token = require('../models/Token');

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

exports.user_login = (req, res, next) => {
    const {token, email, password} = req.body;
    //Logging in
    if(!token){
        passport.authenticate('local', {
            successRedirect: '/dashboard',
            failureRedirect: '/users/login',
            failureFlash: true
        })(req, res, next);
    } else {
        //Confirmation of email handle
        let errors = [];
        //Make sure email is registered in DB
        User.findOne({email: email})
            .then(user => {
                //if no user exists send message back
                if (!user) {
                    errors.push({msg: 'We were unable to find a user with that email.'});
                    res.render('login' , {errors, token});
                }
                //if the user is already verified then just send them to log in
                else if (user.is_verified) {
                    errors.push({msg: 'This email is already verified. Please log in.'});
                    res.render('login', {errors});
                }
                else{
                    //Find that token is a valid token
                    Token.findOne({token: token})
                        .then(found_token => {
                            //if no valid token found, send new token to email
                            if(!found_token){
                                // Create a verification token for this user
                                var new_token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
                    
                                // Save the verification token
                                new_token.save()
                                    .then(saved_token => {
                                        mailOptions.to = email;
                                        mailOptions.text = 'Hello,\n\n' + 'Please verify your Agora account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/users'+ '\/login'+ '\/confirmation\/' + new_token.token + '\n and logging in'+ '.\n';
                                        
                                        transporter.sendMail(mailOptions, function (err) {
                                            if(err) { 
                                                console.log(err);
                                            } else {
                                                console.log('A new verification email has been sent to ' + email + '.');
                                            }
                                        });
                                    })
                                    .catch(err => console.log(err));

                                
                                errors.push({ msg: 'We were unable to find a valid token. Your token may have expired but a new one was sent to ' + email});
                                res.render('login' , {errors, token});
                            }
                            //sign 
                            else {
                                // Verify and save the user
                                user.is_verified = true;
                                user.save()
                                    .then(saved_user => {
                                        Token.findOneAndDelete({token:token})
                                            .then()
                                            .catch();
                                        passport.authenticate('local', {
                                            successRedirect: '/dashboard',
                                            failureRedirect: '/users/login',
                                            failureFlash: true
                                        })(req, res, next);
                                    })
                                    .catch(err => console.log(err));
                            }
                        });
                }
            });
    }
};

exports.get_user_login = (req, res) => {
    //Check for if confirming email link
    if(req.params.token){
        let token = req.params.token;
        res.render('login', {token});
    } else {
        res.render('login');
    }
};

exports.user_logout = (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
};

exports.get_user_registration = (req, res) => {
    res.render('register');
};

exports.user_registration = (req, res) => {

    //Extract from registers form
    const { fname, lname, username, email, password, password2 } = req.body;

    let errors = [];
    //Check required fields are filled
    if (!fname || !lname || !username || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    // //Check that username length is greater than 4
    // if (username.length < 6) {
    //     errors.push({ msg: 'Username should be at least 4 characters' });
    // }

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
        res.render('register', { errors, fname, lname, username, email, password, password2 });
    } else {
        //Validation passed
        //Check if user already exists
        User.findOne({ username: username })
            .then(user => {
                if (user) {
                    //User exists, re-render register page
                    errors.push({ msg: 'That username is already taken' });
                    res.render('register', { errors, fname, lname, username, email, password, password2 });
                } 
            });

        User.findOne({email: email})
            .then(user2 => {
                if(user2) {
                    errors.push({msg: 'That email is already registered'});
                    res.render('register', { errors, fname, lname, username, email, password, password2 });
                }
            });

        const newUser = new User({
            first_name: fname,
            last_name: lname,
            username: username,
            password: password,
            email: email,
        });

        // Hash password
        bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                //set password to hashed
                newUser.password = hash;

                //save user to database
                newUser.save()
                    .then()
                    .catch(err => console.log(err));

                //create userInfo document for this new user
                const userinfo = new UserInfo({
                    _id: newUser.id,
                });

                // Create a verification token for this user
                var token = new Token({ _userId: newUser._id, token: crypto.randomBytes(16).toString('hex') });
                    
                // Save the verification token
                token.save(function (err) {
                    if (err) { return res.status(500).send({ msg: err.message }); }
            
                    // Send the email
                    mailOptions.to = newUser.email;
                    mailOptions.text = 'Hello,\n\n' + 'Please verify your Agora account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/users'+ '\/login'+ '\/confirmation\/' + token.token + '\n and logging in'+ '.\n';

                    transporter.sendMail(mailOptions, function (err) {
                        if(err) { 
                            console.log(err);
                        } else {
                            console.log('A verification email has been sent to ' + user.email + '.');
                        }
                    });
                });

                //save userInfo to database and redirect to login page
                userinfo.save()
                    .then(user => {
                        req.flash('success_msg', 'A verification email has been sent to ' + newUser.email + '.');
                        res.redirect('/users/login');
                    })
                    .catch(err => console.log(err));
            }))
    }
};

exports.get_user_recovery_request = (req, res) => {
    res.render('recovery');
};

exports.user_recovery_request = (req, res) => {
    const {email} = req.body;
    User.findOne({email: email})
        .then( user => {
            if(!user){
                errors.push({msg: 'We were unable to find a user with that email.'});
                res.render('register' , {errors});
            }
            else {
                // Create a verification token for this user
                var new_token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
                    
                // Save the verification token
                new_token.save()
                    .then(saved_token => {
                        mailOptions.to = email;
                        mailOptions.subject = 'Agora Password Reset';
                        mailOptions.text = 'Hello,\n\n' + 'You can reset your Agora password by clicking this link: \nhttp:\/\/' + req.headers.host + '\/users'+ '\/recovery\/' + new_token.token + '.\n';
                                                        
                        transporter.sendMail(mailOptions, function (err) {
                            if(err) { 
                                console.log(err);
                            } else {
                                console.log('A new verification email has been sent to ' + email + '.');
                            }
                        });
                    })
                    .catch(err => console.log(err));
                
                req.flash('success_msg', 'An email was sent to ' + user.email + ' to reset your password.');
                res.redirect('/users/login');
            }
        });
};

exports.get_user_password_reset = (req, res) => {
    let token1 = req.params.token;
    res.render('recovery-reset', {token1});
};

exports.user_password_reset = (req, res) => {
    const {token1, email, password, password2} = req.body;
    //Confirmation of email handle
    let errors = [];
    //Check if valid token
    Token.findOne({token: token1})
        .then(token => {
            if(!token){
                errors.push({ msg: 'We were unable to find a valid token. Your token may have expired.'});
                res.render('recovery' , {errors});
            }
            else {
                User.findOne({email: email})
                    .then(user => {
                        //the user id matches the token
                        if(toString(user._id) == toString(token._userId)){

                            if (!email || !password || !password2) {
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
                                res.render('recovery-reset', { errors, token1, email, password, password2 });
                            } else {
                                user.password = password2;
                                bcrypt.genSalt(10, (err, salt) =>
                                    bcrypt.hash(user.password, salt, (err, hash) => {
                                        if (err) throw err;
                                        //set password to hashed
                                        user.password = hash;

                                        user.save()
                                            .then( update => {
                                                Token.findOneAndDelete({token:token1})
                                                    .then()
                                                    .catch();
                                                req.flash('success_msg', 'Your password has now been updated.');
                                                res.redirect('/users/login');
                                            })
                                            .catch(err => console.log(err))
                                }))
                            }

                        } else {
                            console.log('not a match' + user._id +" " + token._userId);
                            errors.push({ msg: 'That token does not match the email.'});
                            res.render('recovery' , {errors});
                        }
                    })
                    .catch(err => console.log(err))

            }
        });
};