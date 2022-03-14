const Item = require('../models/item');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ErrorHandler = require('../services/errorhandler');
const Category = require('../models/category')

exports.createItem = catchAsyncErrors(async (req, res, next) => {
    const { categoryId, description, itemName, price, isNonVeg, inStock } = req.body;

    const category = await Category.findById(categoryId);

    if (!category) {
        return next(new ErrorHandler('Category does Not Exist', 404))
    }

    const item = await Item.create({
        storeId: req.user._id,
        itemName,
        price,
        isNonVeg,
        inStock,
        description,
        image,
        categoryId,
    })

    await item.save();

    category.items.push(item);
    await category.save();

    return res.status(201).json({
        message: `${itemName} created Successfully`,
        success: true,
        item
    })
})