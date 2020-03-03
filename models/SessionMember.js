const mongoose = require('mongoose');

const SessionMemberSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session'
    },
    tutors: [ { type: mongoose.Schema.Types.ObjectId,
                ref: 'User'}],
    members: [ { type: mongoose.Schema.Types.ObjectId,
                ref: 'User'}],
});

module.exports = mongoose.model('SessionMember', SessionMemberSchema);