const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    addressId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: true
    },
    orderAmount: {
        type: Number,
        required: true
    },
    paymentType: {
        type: String,
        enum: ['cod', 'card'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'cancelled', 'refund']
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Items'
            },
            price: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    orderStatus: [
        {
            type: {
                type: String,
                enum: ['ordered', 'baking', 'shipped', 'delivered', 'cancelled']
            },
            date: {
                type: Date
            },
            isCompleted: {
                type: Boolean,
                default: false
            }
        }
    ]
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);