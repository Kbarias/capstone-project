const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    user_name: {
        type: String,
        required: true
    },
    user_pw: {
        type: String,
        required: true
    },
    full_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    is_admin: {
        type: Boolean,
        default: false,
        required: true
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('User', UserSchema);