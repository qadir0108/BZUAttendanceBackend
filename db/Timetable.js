const mongoose= require( 'mongoose');
const timeTableSchema= new mongoose. Schema({
Room : {
    type: String,
     required:true
    } ,
Teacher : {
    type: String,
     required:true
    } ,
SubjectCode : {
    type: String,
     required:true
    } ,
Subject : {
    type: String,
     required:true
    } ,
Day : {
    type: Number,
     required:true,
     enum: [1,2,3,4,5]
    } ,
TimeSlot  :{
    type: Number,
     required:true,
     enum: [1,2,3,4]
    } ,
Session  : {
    type: Number,
     required:true
    } 
});
module.exports= mongoose.model('timetable',timeTableSchema);