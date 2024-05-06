const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
        maxlength: 20,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm password'],
        validate: {
            // This only works on CREATE and SAVE
            validator: function (el) {
                return el === this.password;
            },
            message: "Passwords are not the same!"
        }
    }
})

userSchema.pre('save', async function (next) {
    // Run this function when password is actually modified
    if (!this.isModified('password')) return next();

    // hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    // delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
})

// Instance method is available on all documents of certain collection
userSchema.methods.correctPassword = async function (candidataPassword, userPassword) {
    return await bcrypt.compare(candidataPassword, userPassword)
}

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;