const mongoose = require('mongoose');

const SessionMemberSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session'
    },
    is_tutoring: Boolean,
    tutors: [{ 
        type: mongoose.Schema.Types.ObjectId,   
        ref: 'User'
    }],
    members: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    is_deleted: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('SessionMember', SessionMemberSchema);