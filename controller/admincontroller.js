const Store = require('../models/store');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ErrorHandler = require('../services/errorhandler');

exports.registerAdmin = catchAsyncErrors(async (req, res, next) => {
    const { email, password, storeName } = req.body;

    if (!email || !storeName || !password) {
        return next(new ErrorHandler("All Fields required", 400))
    }

    let storeExist = await Store.findOne({ email, storeName });

    if (storeExist) {
        return next(new ErrorHandler("Store Already Exist", 400))
    }


    let store = await Store.create({ storeName, email, password })
    await store.save()

    const token = store.getJWTToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    }
    res.cookie('token', token, options)
    res.status(201).json({
        success: true,
        token,
        store,
        message: 'Store created successfully'
    })
})


exports.login = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("All field are required", 401))
    }

    let store = await Store.findOne({ email }).select('+password');

    if (!store) {
        return next(new ErrorHandler("Invalid Email or password", 401))
    }

    let ismatched = await store.comparePassword(password);

    if (!ismatched) {
        return next(new ErrorHandler("Invalid Email or Password", 401))
    }

    const token = store.getJWTToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    }
    res.cookie('token', token, options)
    res.status(200).json({
        success: true,
        token,
        store,
        message: 'Login successfully'
    })
})

exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'Logout Successfully'
    })
})