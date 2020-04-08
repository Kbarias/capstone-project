const mongoose = require('mongoose');
const User = require('../models/User');
const UserInfo = require('../models/UserInfo');
const Place = require('../models/Place');
const Session = require('../models/Session');
const Merch = require('../models/Merch');
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
    Promise.all([
        User.findOne({_id:userid}),
        UserInfo.countDocuments({$and: [ {_id:{$ne:userid}} , {is_deleted:{$ne:true}} ]}),
        UserInfo.countDocuments({$and:[ {_id:{$ne:userid}} , {account_status:'Active'} , {is_deleted:{$ne:true}} ]}),
        User.countDocuments({$and:[ {_id:{$ne:userid}} , {account_status:'Blocked'}, {is_deleted:{$ne:true}} ]}),
        Place.countDocuments( {is_deleted:{$ne:true}} ),
        Place.countDocuments( {$and: [{is_verified: true} , {is_deleted:{$ne:true}} ]} ),
        Session.countDocuments( {is_deleted:{$ne:true}} )
    ])
    .then(results => {
        const [admin_user, all_users, actives, blocked, places, pending, sessions] = results;
        const users = UserInfo.find({$and: [ {_id:{$ne:userid}} , {is_deleted:{$ne:true}} ] }).populate('_id');
        users.exec(function (err, data){
            if(err) throw err;
            res.render('dashboard-admin', { id:req.params.id, member: admin_user.first_name, actives: actives, blocked:blocked, places:places, pending:pending, sessions:sessions, all_users:all_users , users:data});
        });
        
    })
    .catch(err => console.log(err));
};

exports.get_member_dashboard_page = (req, res) => {
    let userid = req.params.id.slice(0,-1)

    User.findOne({_id:userid})
        .then( user => {
            const books = Merch.find({$and: [ {status:{state:"Available"}} , {is_deleted:{$ne:true}} ] }).populate('book');
            books.exec(function (err, data){
                if(err) throw err;
                res.render('dashboard1', { id:req.params.id , member: user.first_name, books:data});
            });
            
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
