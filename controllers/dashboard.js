const mongoose = require('mongoose');
const User = require('../models/User');
const nodemailer = require('nodemailer');

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
    subject: 'Administrator Invitation', 
    text: '' 
};

exports.get_admin_dashboard_page = (req, res) => {
    let userid = req.params.id.slice(0,-1)
    User.findOne({_id:userid})
        .then( user => {
            res.render('dashboard-admin', { id:req.params.id, member: user.first_name});
        })
        .catch(err => console.log(err))
};

exports.get_member_dashboard_page = (req, res) => {
    let userid = req.params.id.slice(0,-1)

    User.findOne({_id:userid})
        .then( user => {
            res.render('dashboard1', { id:req.params.id , member: user.first_name});
        })
        .catch(err => console.log(err))
};

exports.send_admin_invite = (req, res) => {
    const {useremail} = req.body;
    const userid = req.params.id;
    let errors = [];

    //get user
    User.findOne({email: useremail})
        .then(user => {
            if(!user){
                errors.push({msg: 'We were unable to find a user with that email.'});
                res.render('dashboard-admin' , { id:req.params.id, errors, member:req.params.member});
            }
            else{
                //Create and send admin invite
                mailOptions.to = user.email;
                mailOptions.text = 'Hello,\n\n' + 'You have been invited to become an Agora Administrator. Please click on the link to confirm your participation: \nhttp:\/\/' + req.headers.host + '\/users'+ '\/admin-invite'+ '\/'+ user._id +'.\n';
                transporter.sendMail(mailOptions, function (err) {
                    if(err) { 
                        console.log(err);
                    }
                });
                req.flash('success_msg', 'An administrator invitation was send to ' + user.email + '.');
                res.redirect('/dashboard/admin/' + req.params.id + '/' + req.params.member);
            }
        })
        .catch(err => console.log(err));
};
