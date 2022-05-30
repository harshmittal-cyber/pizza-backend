const nodemailer = require('nodemailer');
const catchAsyncErrors = require('../../middleware/catchAsyncErrors');
const ErrorHandler = require('../../services/errorhandler');
const { contactMail } = require('../../services/sendEmail')

module.exports.contact = catchAsyncErrors(async (req, res, next) => {
    const { username, message, date, email, location, contact, organisation } = req.body;

    if (Object.keys(req.body).length < 7) {
        return next(new ErrorHandler("All Fields Required", 400))
    }

    await contactMail(username, email, message, organisation, contact, res)
    return res.status(200).json({ success: true })
})