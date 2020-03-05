const mongoose = require('mongoose');

const StatusSchema = mongoose.Schema({
    rent_info: {
        start_date: Date,
        return_date: Date,
        days_late: Number
    },
    purchase_date: Date
});

module.exports = mongoose.model('Status', StatusSchema);