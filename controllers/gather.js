 const Session = require('../models/Session');
 const SessionMember = require('../models/SessionMember');
 const UserInfo = require('../models/UserInfo');

exports.get_gather_page = (req, res) => {
    let userid = req.params.id.slice(0,-1);
    //find all existing tutoring sessions I am a part of either as a tutor or a member or an organizer
    const all_mysessions = SessionMember.find({$or:[{tutors:userid, is_deleted:false, is_tutoring:true }, {members:userid, is_deleted:false, is_tutoring:true}, {is_deleted:false, is_tutoring:true, '_id.organizers':userid}]}).populate({path: '_id', populate: { path: 'place', model:'Place'}});
    all_mysessions.exec(function (err, data){
        if(err) throw err;
        res.render('gather', { id: req.params.id , member: req.params.member, mysessions:data });
    });
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
    res.render('tutor-create', { id: req.params.id ,member: req.params.name });
    // var placestring = '5e9a217df0f2b70878526fc4';
    // var tutorstring = '5e8383480a39361a66b045cc';
    // let userid = req.params.id.slice(0,-1);
    // var newTutoringSess = new Session({place:placestring, name:'Machine Learning 101', is_tutoring:true, capacity:10, time:'5/13/2020', description:'Learn machine learning basics', is_public:false});
    // newTutoringSess.editors.push(userid);

    // var newmembers = new SessionMember({_id:newTutoringSess._id});
    // newmembers.tutors.push(tutorstring);
    // newmembers.members.push(userid);

    // newTutoringSess.save()
    //     .then(savedsess => {
    //         newmembers.save()
    //             .then(savedmembers => {
                    
    //             })
    //     })
    
};

exports.join_tutoring_session = (req, res) => {
    let userid = req.params.id.slice(0,-1);
    //find the tutoring session make sure that I am not already a part of this session
    SessionMember.findOne({_id:req.params.sessionid, members:{$ne:userid}, tutors:{$ne:userid}}).populate('_id')
        .then(found_session => {
            if(found_session){
                SessionMember.findByIdAndUpdate({_id:req.params.sessionid}, {$push:{members: userid}})
                    .then(save_member => {
                        req.flash('success_msg', 'You have been added to the ' + found_session._id.name + " tutoring session" );
                        res.redirect('/gather/tutor-join-info/'+ req.params.id +'/' + req.params.member);
                    })
            }
            else{
                req.flash('error_msg', 'You are already a member or tutor of this tutoring session');
                res.redirect('/gather/tutor-join-info/'+ req.params.id +'/' + req.params.member);
            }
        })
        
};

exports.get_tutoring_session_info = (req, res) => {
    //find all sessions that are public
    const sessions = Session.find({is_public:true, is_deleted:false, is_tutoring:true}).populate('organizers'); 
    sessions.exec(function (err, data){
        if(err) throw err;
        SessionMember.findOne({_id:req.params.sessinfo}).populate('_id').populate({path: '_id', populate: { path: 'organizers', model:'User'}}).populate('tutors').populate('members').populate({path: '_id', populate: { path: 'place', model:'Place'}})
            .then(sessioninfo => {
                res.render('tutor-join', { id: req.params.id ,member:req.params.member, sessions:data, info:sessioninfo });
            })
    });

};