const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cartItems: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Items',
                required: true
            },
            quantity: { type: Number, default: 1 }
        }
    ]
}, {
    timestamps: true
})



module.exports = mongoose.model('Cart', cartSchema);