const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
    state: {
        type: String,
        required: true,
        trim: true,
    },
    pinCode: {
        type: Number,
        required: true,
        trim: true,
    },
    phoneNumber: {
        type: Number,
        required: true,
        trim: true
    },

});

const userAddressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    address: [addressSchema]
}, {
    timestamps: true
})


mongoose.model('Address', addressSchema);

module.exports = mongoose.model("UserAddress", userAddressSchema)