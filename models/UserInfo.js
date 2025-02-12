const mongoose = require('mongoose');

const UserInfoSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    account_status: {
        type: String,
        default: 'Active'
    },
    is_admin: {
        type: Boolean,
        default: false,
        required: true
    },
    rating: {
        num:{ type: Number, default: 0},
        people: { type: Number, default: 0}
    },
    last_login: {
        type: Date
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('UserInfo', UserInfoSchema);