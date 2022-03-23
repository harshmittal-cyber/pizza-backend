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

exports.getCategories = catchAsyncErrors(async (req, res, next) => {
    const categories = await Category.find({ storeId: req.params.storeId });

    if (!categories) {
        return next(new ErrorHandler('InValid Store', 404))
    };

    return res.status(200).json({
        message: 'Category Found Successfully',
        categories
    })
})

exports.deleteCategory = catchAsyncErrors(async (req, res, next) => {
    const category = await Category.findById(req.params.categoryId);

    if (!category) {
        return next(new ErrorHandler("Invalid Category", 404))
    }

    await Item.deleteMany({
        categoryId: category._id
    })

    await category.remove();
    res.status(200).json({
        _id: req.params.categoryId,
        message: `Category Deleted Successfully`,
    });
})


exports.updateCategories = catchAsyncErrors(async (req, res, next) => {
})