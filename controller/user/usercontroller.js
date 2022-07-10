const User = require('../../models/user');
const catchAsyncErrors = require('../../middleware/catchAsyncErrors');
const ErrorHandler = require('../../services/errorhandler');
const otpworker = require('../../services/otp');

exports.sendOtp = catchAsyncErrors(async (req, res, next) => {
    const { phone } = req.body;

    if (!phone) {
        return next(new ErrorHandler("Phone Number is required", 400))
    }

    let otp = otpworker.generateotp();

    let expiretime = Date.now() + 1000 * 60 * 5;

    //sendign the data with otp and phone no. and expiretime
    let data = `${otp}.${phone}.${expiretime}`;
    let hash = otpworker.hashotp(data);
    const origin = req.get('origin')
    await otpworker.sendOtp(otp, phone, origin);

    return res.status(200).json({
        success: true,
        message: 'Otp sent successfully',
        hash: `${hash}.${expiretime}`,
        phone, otp
    })
})

module.exports.verifyOtp = catchAsyncErrors(async (req, res, next) => {
    const { hash, otp, phone } = req.body;

    if (!otp || !hash || !phone) {
        return next(new ErrorHandler("All Fields Required", 400))
    }

    const [hashotp, expire] = hash.split(".");

    if (Date.now() > +expire) {
        return next(new ErrorHandler("Otp Expired", 401))
    }


    const data = `${otp}.${phone}.${expire}`;

    const isValid = otpworker.verifyOtp(hashotp, data);

    if (!isValid) {
        return next(new ErrorHandler("Invalid OTP", 401))
    }

    let user;
    user = await User.findOne({ phone });
    //if user is not in db the create the user
    if (user === null) {
        user = await User.create({ phone });
        await user.save()
    }

    const token = user.getJWTToken();

    return res.status(200).json({
        message: 'Login Successfully',
        success: true,
        token,
        user
    })
})