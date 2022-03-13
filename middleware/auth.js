const jwt = require('jsonwebtoken');
const catchAsyncErrors = require('./catchAsyncErrors');
const ErrorHandler = require('../services/errorhandler');
const Store = require('../models/store');

exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return next(new ErrorHandler("Please Login to access this resource", 401))
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    const store = await Store.findById(decodedData.id);

    if (!store) {
        return next(new ErrorHandler("Store Not Found", 401))
    }

    req.user = store
    next()
})