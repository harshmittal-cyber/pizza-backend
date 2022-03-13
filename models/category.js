const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema({
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store'
    },
    name: {
        type: String,
        required: [true, 'Category Name is required']
    },
    items: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Items'
        }
    ]
}, {
    timestamps: true
})




module.exports = mongoose.model('Category', categorySchema)
