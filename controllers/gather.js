 const Session = require('../models/Session');
 const SessionMember = require('../models/SessionMember');
 const UserInfo = require('../models/UserInfo');
 const Place = require('../models/Place');
 const User = require('../models/User');
 const nodemailer = require('nodemailer');

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

exports.get_gather_page = (req, res) => {
    let userid = req.params.id.slice(0,-1);
    //find all existing tutoring sessions I am a part of either as a tutor or a member or an organizer
    const all_mygroups = SessionMember.find({$or:[{members:userid, is_deleted:false, is_tutoring:false}, {is_deleted:false, is_tutoring:false, '_id.organizer':userid}]}).populate({path: '_id', populate: { path: 'place', model:'Place'}});
    const all_tutorings = SessionMember.find({$or:[{members:userid, is_deleted:false, is_tutoring:true}, {is_deleted:false, is_tutoring:true, '_id.organizer':userid}]}).populate({path: '_id', populate: { path: 'place', model:'Place'}});
    const my_org_sess = Session.find({is_deleted:false,'organizer':userid}).populate('place');
    all_mygroups.exec(function (err, data){
        all_tutorings.exec(function (err, data1){
            my_org_sess.exec(function (err, data3){
                if(err) throw err;
                res.render('gather', { id: req.params.id , member: req.params.member, mytutoring:data1, org_sessions:data3, mygroups: data});
            });
        });
    });
};

exports.join_invited_session = (req, res) => {
    let userid = req.params.id;
    Promise.all([
        SessionMember.findOne({_id:req.params.sessionid, members:{$ne:userid}}).populate('_id'),
        Session.findOne({_id:req.params.sessionid, organizer:{$ne:userid}})
    ])
    .then(results =>{
        //find the session make sure that I am not already a member or organizer of this session
        const [found_sm, found_sess] = results;

        if(found_sm && found_sess){
            SessionMember.findByIdAndUpdate({_id:req.params.sessionid}, {$push:{members: userid}})
                .then(save_member => {
                    req.flash('success_msg', 'You have been added to the ' + found_sm._id.name + " session." );
                    res.redirect('/users/login');
                })
        }
        else{
            req.flash('error_msg', 'You are already a member or organizer of this session, or this session was deleted.');
            res.redirect('/users/login');
        }
    })
};

exports.delete_session = (req, res) => {
    Promise.all([
        Session.findOneAndUpdate({_id:req.params.sessionid}, {is_deleted:true}),
        SessionMember.findOneAndUpdate({_id:req.params.sessionid}, {is_deleted:true}).populate('members')
    ])
    .then(results => {
        const [session, members] = results;

        for(var i = 0; i < members.members; i++){
            mailOptions.to = members.members[i].email;
            mailOptions.subject = 'Your Agora group has been deleted.';
            mailOptions.text = 'Hello,\n\n' + 'Your Agora group called ' + session.name + ' was deleted by the organizer.';
            transporter.sendMail(mailOptions, function (err) {
                if(err) { 
                    console.log(err);
                }
            });
        }
        req.flash('success_msg', 'You have successfully deleted your group. Any existing members were notified via email of the deletion.');
        res.redirect('/gather/'+ req.params.id +'/' + req.params.member);

    })
};

exports.create_group_page = (req, res) => {
    let userid = req.params.id.slice(0,-1);
    //find user that are active, not this user, and are not deleted
    const users = UserInfo.find({_id:{$ne:userid}, account_status:"Active" , is_deleted:false}).populate('_id');
    users.exec(function (err, data){
        if(err) throw err;
        const places = Place.find({is_verified:true, is_deleted:false});
        places.exec(function (err, pdata){
            if(err) throw err;
            res.render('gather-create', { id: req.params.id ,member: req.params.member, users:data, places:pdata });
        });
    });
};

exports.create_group = (req, res) => {
    let userid = req.params.id.slice(0,-1);
    const {session_type, name, description, capacity, person1, person2, person3, person4, person5, person6, person7, person8, person9, person10, place, date, starttime, endtime} = req.body;

    let times = [];
    times.push(starttime, endtime);

    let is_pub = true;
    if(session_type == 'Private'){ 
        is_pub = false;
    }

    times.forEach( function (value, index){
        var time = value.split(':');
        var hour = (time[0] % 12) || 12;
        if(time[0]>= 12){ 
            times[index] = hour + ":" + time[1] + " " + "PM"; 
        }
        else{
            times[index] = hour + ":" + time[1] + " " + "AM";
        }
    })

    Promise.all([
        User.findOne({username:person1.trim()}),
        User.findOne({username:person2.trim()}),
        User.findOne({username:person3.trim()}),
        User.findOne({username:person4.trim()}),
        User.findOne({username:person5.trim()}),
        User.findOne({username:person6.trim()}),
        User.findOne({username:person7.trim()}),
        User.findOne({username:person8.trim()}),
        User.findOne({username:person9.trim()}),
        User.findOne({username:person10.trim()}),
        Place.findOne({'address.full_address':place.split(':')[1].trim()})
    ])
    .then(results => {
        const [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, location] = results;

        let people = [];
        people.push(p1, p2, p3, p4, p5, p6, p7, p8, p9, p10);

        var newGroup = new Session({
            place: location._id,
            organizer: userid,
            name: name.trim(),
            is_tutoring: false,
            capacity: capacity,
            time: {
                start: times[0],
                end: times[1]
            },
            date: date,
            description: description.trim(),
            is_public: is_pub
        });

        var newMembers = new SessionMember({
            _id: newGroup._id,
            is_tutoring: false
        });

        for(var i = 0; i < people.length; i++){
            if(people[i] != null){
                mailOptions.to = people[i].email;
                mailOptions.subject = 'You have been invited to an Agora Group!';
                mailOptions.text = 'Hello,\n\n' + 'You were invited to be part of a group called ' + newGroup.name + ' on ' 
                    + newGroup.date + ' at' + newGroup.time.start + ' - ' + newGroup.time.end 
                    + '. The location for this session is ' 
                    + location.address.full_address + '. Become a member by clicking the link to be added :\nhttp:\/\/' + req.headers.host + '\/gather'+ '\/invited-join'+ '\/'+ people[i]._id + '\/'+ '\/' + newGroup._id +'.\n';
                transporter.sendMail(mailOptions, function (err) {
                    if(err) { 
                        console.log(err);
                    }
                });
            }
        }

        newGroup.save()
            .then(saved_group => {
                newMembers.save()
                    .then(saved_members => {
                        req.flash('success_msg', 'You have successfully created a group session and any members you invited will receive an email.');
                        res.redirect('/gather/'+ req.params.id +'/' + req.params.member);
                    })
            })

    })
};

exports.get_group_session_info = (req, res) => {
        //find all group sessions that are public
        const sessions = Session.find({is_public:true, is_deleted:false, is_tutoring:false}).populate('organizer'); 
        sessions.exec(function (err, data){
            if(err) throw err;
            SessionMember.findOne({_id:req.params.sessinfo}).populate('_id').populate({path: '_id', populate: { path: 'organizer', model:'User'}}).populate('members').populate({path: '_id', populate: { path: 'place', model:'Place'}})
                .then(sessioninfo => {
                    res.render('gather-join', { id: req.params.id ,member:req.params.member, sessions :data, info:sessioninfo });
                })
        });
};

exports.join_gathering = (req, res) => {
    let userid = req.params.id.slice(0,-1);
    Promise.all([
        SessionMember.findOne({_id:req.params.sessionid, members:{$ne:userid}}).populate('_id'),
        Session.findOne({_id:req.params.sessionid, organizer:{$ne:userid}})
    ])
    .then(results =>{
        //find the group session make sure that I am not already a member or organizer of this session
        const [found_sm, found_sess] = results;

        if(found_sm && found_sess){
            SessionMember.findByIdAndUpdate({_id:req.params.sessionid}, {$push:{members: userid}})
                .then(save_member => {
                    req.flash('success_msg', 'You have been added to the ' + found_sm._id.name + " group." );
                    res.redirect('/gather/group-join-info/'+ req.params.id +'/' + req.params.member);
                })
        }
        else{
            req.flash('error_msg', 'You are already a member or organizer of this group.');
            res.redirect('/gather/group-join-info/'+ req.params.id +'/' + req.params.member);
        }
    })

};

exports.organizer_details = (req, res) => {
    //get information for the session i am organizer for
    SessionMember.findOne({_id:req.params.sessionid}).populate('_id').populate({path: '_id', populate: { path: 'organizer', model:'User'}}).populate('members').populate({path: '_id', populate: { path: 'place', model:'Place'}})
        .then(sessioninfo => {
            res.render('session_organizer', { id: req.params.id ,member:req.params.member, info:sessioninfo, editing:req.params.edit });
        })
};

exports.organizer_edit_details = (req, res) => {
    const {name, description, date, start, end} = req.body;

    Session.findOne({_id:req.params.sessionid})
        .then(session => {
            let up_name, up_description, up_date, up_start, up_end;
            if(name != null){
                up_name = name;
            } else {
                up_name = session.name;
            }
            if(description != null){
                up_description = description;
            }else{
                up_description = session.description;
            }
            if(date != null){
                up_date = date;
            } else {
                up_date = session.date;
            }
            if(start != null){
                var time = start.split(':');
                var hour = (time[0] % 12) || 12;
                if(time[0]>= 12){ 
                    up_start = hour + ":" + time[1] + " " + "PM"; 
                }
                else{
                    up_start = hour + ":" + time[1] + " " + "AM";
                }
            } else{
                up_start = session.time.start;
            }
            if(end != null){
                var time = end.split(':');
                var hour = (time[0] % 12) || 12;
                if(time[0]>= 12){ 
                    up_end = hour + ":" + time[1] + " " + "PM"; 
                }
                else{
                    up_end = hour + ":" + time[1] + " " + "AM";
                }
            } else{
                up_end = session.time.end;
            }

            SessionMember.findOne({_id:req.params.sessionid}).populate('members')
                .then(info => {
                    for(var i = 0; i < info.members.length; i ++){
                        mailOptions.to = info.members[0].email;
                        mailOptions.subject = 'Your Agora Session has been updated';
                        mailOptions.text = 'Hello,\n\n' + 'The Agora session ' + info.name + ' has been updated. Please check Agora for the updated details.';
                        transporter.sendMail(mailOptions, function (err) {
                            if(err) { 
                                console.log(err);
                            }
                        });
                    }
                    Session.findOneAndUpdate({_id:req.params.sessionid}, {name:up_name, description:up_description, date:up_date, 'time.start': up_start, 'time.end': up_end})
                    .then(updated => {
                        req.flash('success_msg', 'You have successfully edited your session. Members will be notified.' );
                        res.redirect('/gather/'+ req.params.id +'/' + req.params.member);
                    })
                })
        })

};

exports.create_tutoring_session = (req, res) => {
    let userid = req.params.id.slice(0,-1);
    const {session_type, name, description, capacity, person1, person2, person3, person4, person5, person6, person7, person8, person9, person10, place, date, starttime, endtime} = req.body;

    let times = [];
    times.push(starttime, endtime);

    let is_pub = true;
    if(session_type == 'Private'){ 
        is_pub = false;
    }

    times.forEach( function (value, index){
        var time = value.split(':');
        var hour = (time[0] % 12) || 12;
        if(time[0]>= 12){ 
            times[index] = hour + ":" + time[1] + " " + "PM"; 
        }
        else{
            times[index] = hour + ":" + time[1] + " " + "AM";
        }
    })

    Promise.all([
        User.findOne({username:person1.trim()}),
        User.findOne({username:person2.trim()}),
        User.findOne({username:person3.trim()}),
        User.findOne({username:person4.trim()}),
        User.findOne({username:person5.trim()}),
        User.findOne({username:person6.trim()}),
        User.findOne({username:person7.trim()}),
        User.findOne({username:person8.trim()}),
        User.findOne({username:person9.trim()}),
        User.findOne({username:person10.trim()}),
        Place.findOne({'address.full_address':place.split(':')[1].trim()})
    ])
    .then(results => {
        const [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, location] = results;

        let people = [];
        people.push(p1, p2, p3, p4, p5, p6, p7, p8, p9, p10);

        var newTutoring = new Session({
            place: location._id,
            organizer: userid,
            name: name.trim(),
            is_tutoring: true,
            capacity: capacity,
            time: {
                start: times[0],
                end: times[1]
            },
            date: date,
            description: description.trim(),
            is_public: is_pub
        });

        var newMembers = new SessionMember({
            _id: newTutoring._id,
            is_tutoring: false
        });

        for(var i = 0; i < people.length; i++){
            if(people[i] != null){
                mailOptions.to = people[i].email;
                mailOptions.subject = 'You have been invited to an Agora Tutoring Session!';
                mailOptions.text = 'Hello,\n\n' + 'You were invited to be part of a tutoring session called ' + newTutoring.name + ' on ' 
                    + newTutoring.date + ' at' + newTutoring.time.start + ' - ' + newTutoring.time.end 
                    + '. The location for this session is ' 
                    + location.address.full_address + '. Become a member by clicking the link to be added :\nhttp:\/\/' + req.headers.host + '\/gather'+ '\/invited-join'+ '\/'+ people[i]._id + '\/' + newTutoring._id +'.\n';
                transporter.sendMail(mailOptions, function (err) {
                    if(err) { 
                        console.log(err);
                    }
                });
            }
        }

        newTutoring.save()
            .then(saved_tutoring => {
                newMembers.save()
                    .then(saved_members => {
                        req.flash('success_msg', 'You have successfully created a tutoring session and any members you invited will receive an email.');
                        res.redirect('/gather/'+ req.params.id +'/' + req.params.member);
                    })
            })
    })

};

exports.get_tutoring_page = (req, res) => {
    let userid = req.params.id.slice(0,-1);
    //find user that are active, not this user, and are not deleted
    const users = UserInfo.find({_id:{$ne:userid}, account_status:"Active" , is_deleted:false}).populate('_id');
    users.exec(function (err, data){
        if(err) throw err;
        const places = Place.find({is_verified:true, is_deleted:false});
        places.exec(function (err, pdata){
            if(err) throw err;
            res.render('tutor-create', { id: req.params.id ,member: req.params.member, users:data, places:pdata });
        });
    });
    
    
};

exports.join_tutoring_session = (req, res) => {
    let userid = req.params.id.slice(0,-1);
    Promise.all([
        SessionMember.findOne({_id:req.params.sessionid, members:{$ne:userid}}).populate('_id'),
        Session.findOne({_id:req.params.sessionid, organizer:{$ne:userid}})
    ])
    .then(results =>{
        //find the tutoring session make sure that I am not already a member or organizer of this session
        const [found_sm, found_sess] = results;

        if(found_sm && found_sess){
            SessionMember.findByIdAndUpdate({_id:req.params.sessionid}, {$push:{members: userid}})
                .then(save_member => {
                    req.flash('success_msg', 'You have been added to the ' + found_sm._id.name + " tutoring session." );
                    res.redirect('/gather/tutor-join-info/'+ req.params.id +'/' + req.params.member);
                })
        }
        else{
            req.flash('error_msg', 'You are already a member or organizer of this tutoring session.');
            res.redirect('/gather/tutor-join-info/'+ req.params.id +'/' + req.params.member);
        }
    })
        
};

exports.get_tutoring_session_info = (req, res) => {
    //find all tutoring sessions that are public
    const sessions = Session.find({is_public:true, is_deleted:false, is_tutoring:true}).populate('organizer'); 
    sessions.exec(function (err, data){
        if(err) throw err;
        SessionMember.findOne({_id:req.params.sessinfo}).populate('_id').populate({path: '_id', populate: { path: 'organizer', model:'User'}}).populate('members').populate({path: '_id', populate: { path: 'place', model:'Place'}})
            .then(sessioninfo => {
                res.render('tutor-join', { id: req.params.id ,member:req.params.member, sessions:data, info:sessioninfo });
            })
    });

};