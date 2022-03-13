const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    itemName: {
        type: Syring,
        required: [true, 'Item Name is required']
    },
    description: {
        type: String
    },
    price: {
        type: String,
        required: [true, 'Please Enter the price']
    },
    isNonVeg: {
        type: Boolean,
        default: false
    },
    image: {
        type: String
    },
    inStock: {
        type: Boolean,
        default: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }
}, {
    timestamps: true
})


module.exports = mongoose.model('Items', itemSchema);