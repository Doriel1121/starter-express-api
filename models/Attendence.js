const mongoose = require('mongoose');

const AttendenceScheme = mongoose.Schema({
    Amount:String,
    Name: String,
    Phone: String,
    isComming: Boolean,
})

module.exports = mongoose.model('Attendence' , AttendenceScheme);