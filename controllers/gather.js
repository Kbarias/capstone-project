 const Session = require('../models/Session');
 const UserInfo = require('../models/UserInfo');

exports.get_gather_page = (req, res) => {
    res.render('gather', { id: req.params.id , member: req.params.member });
};

exports.create_gathering = (req, res) => {
    let userid = req.params.id.slice(0,-1);
    //have to render all users even admins so that you can select from them
    //have to render all places so that you can select from them
    //have to add users to session members
    //have to add tutors
    //have to make sure that the max of members has not been reached
    const users = UserInfo.find({$and: [ {_id:{$ne:userid}} , {account_status:"Active"} , {is_deleted:false}] }).populate('_id');
    users.exec(function (err, data){
        if(err) throw err;
        res.render('gather-create', { id:req.params.id , member: req.params.member, users:data});
    });
};

exports.join_gathering = (req, res) => {
    //list the tutors
    res.render('gather-join', {id: req.params.id ,  member: req.params.member });
};

exports.create_tutoring_session = (req, res) => {
    res.render('tutor-create', { member: req.params.name });
};

exports.join_tutoring_session = (req, res) => {
    res.render('tutor-join', { member: req.params.name });
};