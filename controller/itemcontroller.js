const Item = require('../models/item');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ErrorHandler = require('../services/errorhandler');
const Category = require('../models/category');
const Jimp = require('jimp');
const path = require('path');

exports.createItem = catchAsyncErrors(async (req, res, next) => {
    const { categoryId, description, itemName, price, isNonVeg, inStock, image } = req.body;

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

exports.updateItem = catchAsyncErrors(async (req, res, next) => {
    let item = await Item.findById(req.params.id)

    if (!item) {
        return next(new ErrorHandler("Item Not Found", 404))
    }

    item = await Item.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        useFindAndModify: false,
        runValidatros: true
    })

    res.status(200).json({
        success: true,
        item
    })
})

exports.deleteItem = catchAsyncErrors(async (req, res, next) => {
    const item = await Item.findById(req.params.id);

    if (!item) {
        return next(new ErrorHandler('Item Not Found', 404))
    }
    let categoryId = item.categoryId
    await item.remove();
    await Category.findByIdAndUpdate(categoryId, { $pull: { items: req.params.itemId } })

    return res.status(200).json({
        _id: req.params.id,
        message: 'Item Deleted Successfully'
    })
})