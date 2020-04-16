const mongoose = require('mongoose');

const AdminTokenSchema = new mongoose.Schema({
    _userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'UserInfo' 
    },
    token: { 
        type: String, 
        required: true 
    }
});

module.exports = mongoose.model('AdminToken', AdminTokenSchema);