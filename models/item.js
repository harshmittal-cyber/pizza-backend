const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    itemName: {
        type: String,
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
    },
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store'
    }
}, {
    timestamps: true
})


module.exports = mongoose.model('Items', itemSchema);