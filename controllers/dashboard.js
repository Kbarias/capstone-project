const mongoose = require('mongoose');
const User = require('../models/User');
const UserInfo = require('../models/UserInfo');
const Place = require('../models/Place');
const Session = require('../models/Session');
const Merch = require('../models/Merch');


exports.get_admin_dashboard_page = (req, res) => {
    let userid = req.params.id.slice(0,-1);
    Promise.all([
        User.findOne({_id:userid}),
        UserInfo.countDocuments( {_id:{$ne:userid} , is_deleted:false} ),
        UserInfo.countDocuments({_id:{$ne:userid} , account_status:'Active' , is_deleted:false} ),
        UserInfo.countDocuments({_id:{$ne:userid}, account_status:'Blocked', is_deleted:false} ),
        Place.countDocuments( {is_deleted:false} ),
        Place.countDocuments( {is_verified: false , is_deleted:false} ),
        Session.countDocuments( {is_deleted:false} )
    ])
    .then(results => {
        const [admin_user, all_users, actives, blocked, places, pending, sessions] = results;
        const users = UserInfo.find({_id:{$ne:userid} , is_deleted:false} ).populate('_id');
        users.exec(function (err, data){
            if(err) throw err;
            UserInfo.findOne({_id:req.params.userinfo}).populate('_id')
                    .then(edit => {
                        res.render('dashboard-admin', { id:req.params.id, member: admin_user.first_name, actives: actives, blocked:blocked, places:places, pending:pending, sessions:sessions, all_users:all_users , users:data, editing:edit});
                    })
        });
        
    })
    .catch(err => console.log(err));
};

exports.get_member_dashboard_page = (req, res) => {
    let userid = req.params.id.slice(0,-1)
    User.findOne({_id:userid})
        .then( user => {
            res.render('dashboard-user', { id:req.params.id , member: user.first_name});
        })
        .catch(err => console.log(err))

        
};

