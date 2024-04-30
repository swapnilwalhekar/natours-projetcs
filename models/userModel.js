const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell your name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide your Email Id'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        maxlength: 20
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm password'],
        validate:{
            // This only works on CREATE and SAVE
            validator : function(el){
                return el === this.password;
            }
        }
    }
})

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;