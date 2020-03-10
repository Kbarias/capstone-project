const mongoose = require('mongoose');

const UserInfoSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    account_status: {
        type: String,
        default: 'active'
    },
    rating: Number,
    is_deleted: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('UserInfo', UserInfoSchema);