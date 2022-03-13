const Category = require('../models/category');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ErrorHandler = require('../services/errorhandler');

exports.createCategory = catchAsyncErrors(async (req, res, next) => {
    const category = await Category.create({
        storeId: req.user._id,
        name: req.body.name
    })

    await category.save()

    return res.status(200).json({
        category,
        success: true,
        message: `${category.name} category created successfully `
    })
})