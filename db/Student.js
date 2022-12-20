const mongoose= require( 'mongoose');
let validator = require('validator');
const bcrypt = require('bcrypt');
const userSchema= new mongoose. Schema({
Name : {
    type: String,
     required:true
    } ,
RollNumber : {
     type  : String,
     required:true,
     index: {unique: true, dropDups: true}
    },
Session : {
    type : Number,
    required:true
   },
Email : {
    type: String,
     required:true,
     validate:[ (value) => {
        return validator.isEmail(value)
      },'Not a valid Email'],
    } ,
Password : {
    type: String,
     required:true
    } 
});


// hash the password
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  };
  
  // checking if password is valid
  userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.Password);
  };
  
module.exports= mongoose.model('students',userSchema)