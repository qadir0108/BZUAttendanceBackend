const mongoose = require('mongoose');
const attendanceSchema = new mongoose.Schema({
    Date: {
        type: Date,
        default: new Date()
    },
    RollNumber: {
        type: String,
        required: true
    },
    TimeSlot: {
        type: Number,
        required: true
    },
    Teacher: {
        type: String,
        required: true
    },
    SubjectCode: {
        type: String,
        required: true
    },
    Subject: {
        type: String,
        required: true
    },
    Status: {
        type: String,
        required: true,
        enum: [0 ,1, 2]
    }
});
module.exports = mongoose.model('attendance', attendanceSchema)