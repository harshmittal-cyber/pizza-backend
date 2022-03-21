const mongoose = require('mongoose');
const validator = require("validator");
const crypto = require('crypto')
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

const storeSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email Field is required"],
        unique: true,
        validate: [validator.isEmail, "Please Enter a valid Email"],
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minLength: [8, "Password should be greater than 8 characters"],
        select: false
    },
    OwnerName: {
        type: String,
    },
    phoneNumber: {
        type: String,
        unique: true,
        sparse: true
    },
    storeName: {
        type: String,
        required: [true, "StoreName is required"],
        unique: true,
        sparse: true
    },
    logo: {
        type: String,
    },
    coverImage: {
        type: String
    },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date }
}, {
    timestamps: true
})

storeSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);
});

//JWT Token
storeSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

// Compare Password

storeSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

storeSchema.methods.getresetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
}


module.exports = mongoose.model('Store', storeSchema)