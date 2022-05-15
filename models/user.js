const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    name: {
        type: String,
        trim: true,
    },
    profile: {
        type: String
    }
}, {
    timestamps: true
})

//JWT Token
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

module.exports = mongoose.model('User', userSchema)

