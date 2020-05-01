const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const UserInfo = require('../models/UserInfo');
const passport = require('passport');
const crypto =  require('crypto');
const nodemailer = require('nodemailer');
const Token = require('../models/Token');
const AdminToken = require('../models/AdminToken');

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
    let errors = [];
    //Logging in
    if(!token){
        User.findOne({email:email})
            .then(user => {
                if(user){
                    UserInfo.findOne({_id:user._id})
                        .then(userinfo => {
                            let admin = '0';
                            if(userinfo.is_admin){
                                admin = '1';
                            }
                            userinfo.last_login = new Date();
                            
                            userinfo.save()
                                .then(log => {
                                    passport.authenticate('local', {
                                        successRedirect: '/dashboard/admin/' + user._id + admin + '/' + user.first_name,
                                        failureRedirect: '/users/login',
                                        failureFlash: true
                                    })(req, res, next);
                                })
                        })
                }
                else {
                    errors.push({msg: 'We were unable to find a user with that email.'});
                    res.render('login' , {errors, token});
                }
            })


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
                                            .then(deleted_token => {
                                                UserInfo.findOne({_id:user._id})
                                                    .then(new_user => {
                                                            let admin = '0';
                                                            if(new_user.is_admin){
                                                                admin = '1';
                                                            }
                                                            new_user.last_login = new Date();

                                                            new_user.save()
                                                                .then(saved_user => {
                                                                    passport.authenticate('local', {
                                                                        successRedirect: '/dashboard/admin/' + new_user._id + admin + '/' + saved_user.first_name,
                                                                        failureRedirect: '/users/login',
                                                                        failureFlash: true
                                                                    })(req, res, next);
                                                                })
                                                            
                                                    })
                                            })
                                            .catch();
                                        
                                        
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
                else {
                    User.findOne({email: email})
                    .then(user2 => {
                        if(user2) {
                            errors.push({msg: 'That email is already registered'});
                            res.render('register', { errors, fname, lname, username, email, password, password2 });
                        }
                        else {
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
                                        .then(saved_user => {
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
                                                    //save userInfo to database and redirect to login page
                                                    userinfo.save()
                                                        .then(user => {
                                                            req.flash('success_msg', 'A verification email has been sent to ' + newUser.email + '.');
                                                            res.redirect('/users/login');
                                                        })
                                                        .catch(err => console.log(err));
                                                });
                                        })
                                        .catch(err => console.log(err));
                    

                                }))
                        }
                    });
                }
            });


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
                        if(!user){
                            errors.push({ msg: 'We were unable to find a user with this email.'});
                            res.render('recovery' , {errors});
                        }
                        else {
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
                        }

                    })
                    .catch(err => console.log(err))

            }
        });
};

exports.become_an_admin = (req, res) => {
    let errors = [];
    //find a token in DB with the userid of this person
    AdminToken.findOneAndDelete({_userId: req.params.id}).populate('_userId')
        .then(user => {
            //a token was found with this person's matching id
            if(user){
                user._userId.is_admin = !user._userId.is_admin;
                user._userId.save()
                    .then(saved => {
                        req.flash('success_msg', 'You are now an administrator for Agora!');
                        res.redirect('/users/login');
                    })
                    .catch(err => console.log(err));
            }
            else {
                errors.push({msg: 'We were unable to find an administrator with that email.'});
                res.render('login' , {errors});
            }
        })

};

exports.delete_user = (req, res) => {
    res.send('deleting: ' + req.params.userid);
};

exports.edit_user = (req, res) => {
    //let userid = req.params.id.slice(0,-1);
    const {block, activate, role} = req.body;
    //no information entered
    if(!block && !activate && role == 0){
        res.redirect('/dashboard/admin/' + req.params.id + '/' + req.params.member + '/' + req.params.userid);
    }
    //no role change
    else if(role == 0){
        //just blocking user
        if(block == 'Blocked'){
            UserInfo.findOneAndUpdate({_id:req.params.userid} , {account_status:'Blocked'}, {new: true}).populate('_id')
                .then(blocked_user => {
                    //Create and send email informing user of status change
                    mailOptions.to = blocked_user._id.email;
                    mailOptions.subject = 'Your Agora account is blocked';
                    mailOptions.text = 'Hello,\n\n' + 'Your account has recently been blocked. Please reach out to an Agora Administrator for information.';
                    transporter.sendMail(mailOptions, function (err) {
                        if(err) { 
                            console.log(err);
                        }
                    });

                    req.flash('success_msg', 'You have successfully blocked ' + blocked_user._id.email + ' and an email was sent to them.');
                    res.redirect('/dashboard/admin/' + req.params.id + '/' + req.params.member);
                })
                .catch(err => console.log(err));
        }
        //just activating user
        else {
            UserInfo.findOneAndUpdate({_id:req.params.userid} , {account_status:'Active'}, {new: true}).populate('_id')
                .then(blocked_user => {
                    //Create and send email informing user of status change
                    mailOptions.to = blocked_user._id.email;
                    mailOptions.subject = 'Your Agora account is unblocked';
                    mailOptions.text = 'Hello,\n\n' + 'Your account has recently been unblocked. You can now login using the link: \nhttp:\/\/' + req.headers.host + '\/users'+ '\/login'+'.\n';
                    transporter.sendMail(mailOptions, function (err) {
                        if(err) { 
                            console.log(err);
                        }
                    });

                    req.flash('success_msg', 'You have successfully unblocked ' + blocked_user._id.email + '.');
                    res.redirect('/dashboard/admin/' + req.params.id + '/' + req.params.member);
                })
                .catch(err => console.log(err));
        }
    }
    //changing role to member
    else if(role == 1){
        //also blocking user
        if(block == 'Blocked'){
            UserInfo.findOneAndUpdate({_id:req.params.userid} , {account_status:'Blocked', is_admin:false}, {new: true}).populate('_id')
                .then(blocked_user => {
                    mailOptions.to = blocked_user._id.email;
                    mailOptions.subject = 'Your Agora account is blocked';
                    mailOptions.text = 'Hello,\n\n' + 'Your account has recently been blocked and your role has changed to "member". Please reach out to an Agora Administrator for information.';
                    transporter.sendMail(mailOptions, function (err) {
                        if(err) { 
                            console.log(err);
                        }
                    });

                    req.flash('success_msg', 'You have successfully blocked ' + blocked_user._id.email + ' and changed their role to "admin". An email was sent to them.');
                    res.redirect('/dashboard/admin/' + req.params.id + '/' + req.params.member);
                })
                .catch(err => console.log(err));
        }
        //also activating user
        else if(activate == 'Active'){
            UserInfo.findOneAndUpdate({_id:req.params.userid} , {account_status:'Active', is_admin:false}, {new: true}).populate('_id')
                .then(blocked_user => {
                    mailOptions.to = blocked_user._id.email;
                    mailOptions.subject = 'Your account is activated';
                    mailOptions.text = 'Hello,\n\n' + 'Your account has recently been unblocked and your role has changed to "member". You can now login using the link: \nhttp:\/\/' + req.headers.host + '\/users'+ '\/login'+'.\n';
                    transporter.sendMail(mailOptions, function (err) {
                        if(err) { 
                            console.log(err);
                        }
                    });

                    req.flash('success_msg', 'You have successfully unblocked ' + blocked_user._id.email + ' and changed their role to "member".');
                    res.redirect('/dashboard/admin/' + req.params.id + '/' + req.params.member);
                })
                .catch(err => console.log(err));
        }
        //just changing role not status
        else {
            UserInfo.findOneAndUpdate({_id:req.params.userid} , {is_admin:false}, {new: true}).populate('_id')
                .then(blocked_user => {
                    mailOptions.to = blocked_user._id.email;
                    mailOptions.subject = 'Your Agora account role has changed';
                    mailOptions.text = 'Hello,\n\n' + 'Your account role has recently changed to "member". You can now login using the link: \nhttp:\/\/' + req.headers.host + '\/users'+ '\/login'+'.\n';
                    transporter.sendMail(mailOptions, function (err) {
                        if(err) { 
                            console.log(err);
                        }
                    });

                    req.flash('success_msg', 'You have successfully changed ' + blocked_user._id.email + ' to a "member".');
                    res.redirect('/dashboard/admin/' + req.params.id + '/' + req.params.member);
                })
                .catch(err => console.log(err));
        }
    }
    //changing role to admin
    else if(role == 2){
        //also blocking user
        if(block == 'Blocked'){
            UserInfo.findOneAndUpdate({_id:req.params.userid} , {account_status:'Blocked'}, {new: true}).populate('_id')
                .then(blocked_user => {
                    var token = new AdminToken({ _userId: blocked_user._id, token: crypto.randomBytes(16).toString('hex') });

                    //create and save an admin token for authorization
                    token.save(function (err) {
                        if (err) { return res.status(500).send({ msg: err.message }); }

                        mailOptions.to = blocked_user._id.email;
                        mailOptions.subject = 'Your Agora account is blocked';
                        mailOptions.text = 'Hello,\n\n' + 'Your account has recently been blocked and you have been invited to become an Agora Admin. Please click on the link to confirm your participation: \nhttp:\/\/' + req.headers.host + '\/users'+ '\/admin-invite'+ '\/'+ blocked_user._id._id +'.\n';
                        transporter.sendMail(mailOptions, function (err) {
                            if(err) { 
                                console.log(err);
                            }
                        });

                        req.flash('success_msg', 'You have successfully blocked ' + blocked_user._id.email + ' and invited them to become an admin. An email was sent to them.');
                        res.redirect('/dashboard/admin/' + req.params.id + '/' + req.params.member);
                    });

                })
                .catch(err => console.log(err));
        }
        //also activating user
        else if(activate == 'Active'){
            UserInfo.findOneAndUpdate({_id:req.params.userid} , {account_status:'Active'}, {new: true}).populate('_id')
                .then(user => {
                    var token = new AdminToken({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

                    token.save(function (err) {
                        if (err) { return res.status(500).send({ msg: err.message }); }
                        mailOptions.to = user._id.email;
                        mailOptions.subject = 'Your Agora account is activated';
                        mailOptions.text = 'Hello,\n\n' + 'Your account has recently been unblocked and you have been invited to be an Agora administrator. Please click on the link to confirm your participation: \nhttp:\/\/' + req.headers.host + '\/users'+ '\/admin-invite'+ '\/'+ user._id._id +'.\n';
                        transporter.sendMail(mailOptions, function (err) {
                            if(err) { 
                                console.log(err);
                            }
                        });

                        req.flash('success_msg', 'You have successfully unblocked ' + user._id.email + ' and invited them to become an admin. An email was sent to them.');
                        res.redirect('/dashboard/admin/' + req.params.id + '/' + req.params.member);
                    });
                })
                .catch(err => console.log(err));
        }
        //just changing role not status
        else {
            UserInfo.findOne({_id:req.params.userid}).populate('_id')
                .then(user => {
                    var token = new AdminToken({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });           
                    token.save(function (err) {
                        if (err) { return res.status(500).send({ msg: err.message }); }

                        mailOptions.to = user._id.email;
                        mailOptions.subject = 'Agora Administrator Invitation';
                        mailOptions.text = 'Hello,\n\n' + 'You have been invited to become an Agora Administrator. Please click on the link to confirm your participation: \nhttp:\/\/' + req.headers.host + '\/users'+ '\/admin-invite'+ '\/'+ user._id._id +'.\n';
                        transporter.sendMail(mailOptions, function (err) {
                            if(err) { 
                                console.log(err);
                            }
                        });

                        req.flash('success_msg', 'You have successfully invited ' + user._id.email + ' to become an Agora admin. They were sent an email.');
                        res.redirect('/dashboard/admin/' + req.params.id + '/' + req.params.member);
                    });
                })
                .catch(err => console.log(err));
        }
    }
};

exports.get_edit_profile_page = (req, res) => {
    res.render('user-profile', {id:req.params.id, member: req.params.member });
};

exports.edit_profile = (req, res)=> {
    const {fname, lname, username, email, password, password2} = req.body;

    //if no entered information
    if (!fname && !lname && !username && !email && !password && !password2) {
        res.redirect('/users/user-profile/' + req.params.id + '/' + req.params.member);
    }

    else {
        let errors = [];
        //Check that username length is greater than 4
        if ( (username) && (username.length < 6) ) {
            errors.push({ msg: 'Username should be at least 6 characters' });
        }

        //Check that passwords match
        if ( (password) && (password != password2) ) {
            errors.push({ msg: 'Passwords do not match' });
        }

        if (errors.length > 0) {
            res.render('user-profile', {id:req.params.id, member:req.params.member, errors, fname, lname, username, email, password, password2 });
        } 
        else {
            //update values for 
            let userid = req.params.id.slice(0,-1);
            User.findOne({_id:userid})
                .then(user => {
                    var name, i_lname, i_username, i_email, i_password;

                    if(!fname){
                        name = user.first_name;
                    }else {name = fname;}

                    if(!lname){
                        i_lname = user.last_name;
                    }else {i_lname = lname;}

                    if(!username){
                        i_username = user.username;
                    }else {i_username = username;}

                    if(!email){
                        i_email = user.email;
                    }else {i_email = email;}

                    if(!password){
                        i_password = user.password;
                        //make sure username is not already taken
                        User.findOne({username:username})
                            .then(found_un => {
                                if(found_un){
                                    errors.push({ msg: 'That username is already taken' });
                                    res.render('user-profile', {id:req.params.id, member:req.params.member, errors, fname, lname, username, email, password, password2 });
                                }
                                else{
                                    User.findOne({email:email})
                                        .then(found_email => {
                                            if(found_email){
                                                errors.push({ msg: 'That email is already registered.' });
                                                res.render('user-profile', {id:req.params.id, member:req.params.member, errors, fname, lname, username, email, password, password2 });
                                            }
                                            else{
                                                User.findOneAndUpdate({_id:userid}, {first_name:name, last_name:i_lname, username:i_username ,email:i_email, password:i_password})
                                                .then(updated_profile => {
                                                    req.flash('success_msg', 'Your profile has been updated.');
                                                    res.redirect('/dashboard/admin/' +  req.params.id + '/' + name);
                                                })
                                            }
                                        })
                                }
                            })
                    }else {
                        //changing to new password
                        i_password = password;
                        bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(i_password, salt, (err, hash) => {
                            if (err) throw err;
                            //set password to hashed
                            new_password = hash;
                            User.findOne({username:username})
                                .then(found_un => {
                                    if(found_un){
                                        errors.push({ msg: 'That username is already taken' });
                                        res.render('user-profile', {id:req.params.id, member:req.params.member, errors, fname, lname, username, email, password, password2 });
                                    }
                                    else{
                                        User.findOne({email:email})
                                            .then(found_email => {
                                                if(found_email){
                                                    errors.push({ msg: 'That email is already registered.' });
                                                    res.render('user-profile', {id:req.params.id, member:req.params.member, errors, fname, lname, username, email, password, password2 });
                                                }
                                                else{
                                                    User.findOneAndUpdate({_id:userid}, {first_name:name, last_name:i_lname, username:i_username ,email:i_email, password:new_password})
                                                    .then(updated_profile => {
                                                        req.flash('success_msg', 'Your profile has been updated.');
                                                        res.redirect('/dashboard/admin/' +  req.params.id + '/' + name);
                                                    })
                                                }
                                            })
                                    }
                                })

                        }))
                    }
                })
        }
    }
};