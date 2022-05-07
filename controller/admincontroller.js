const Store = require('../models/store');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ErrorHandler = require('../services/errorhandler');
const sendEmail = require('../services/sendEmail');
const crypto=require('crypto');
const generateToken=require('../services/generateToken')

exports.registerAdmin = catchAsyncErrors(async (req, res, next) => {
    const { email, password, storeName } = req.body;

    if (!email || !storeName || !password) {
        return next(new ErrorHandler("All Fields required", 400))
    }

    let emailExist = await Store.findOne({ email });
    if (emailExist) {
        return next(new ErrorHandler("Email Already Exist", 400))
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

//forget password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await Store.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler("User Not Found", 404))
    }
    // Get ResetPassword Token
    const resetToken = user.getresetPasswordToken();

    await user.save({ validateBeforeSave: false });
    const resetPasswordUrl = `${req.get('Origin')}/admin/password/reset/${resetToken}`;

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it`;

    try {
        await sendEmail({
            email: user.email,
            subject: `Hungry Reset Password`,
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent successfully`,
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500));
    }
})


exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    // creating token hash
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await Store.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(new ErrorHandler("Link has been Expired", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    const token = await generateToken({ _id: user._id });
    res.cookie('token', token)
    res.status(200).json({
        user,
        token,
        success: true,
        message: 'Password Changed Successfully'
    });
});
