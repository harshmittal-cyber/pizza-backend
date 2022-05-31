const Razorpay = require("razorpay");
const crypto = require("crypto");
const shortid = require('shortid')
const catchAsyncErrors = require('../../middleware/catchAsyncErrors');

const instance = new Razorpay({
    key_id: 'rzp_test_AilGDnJcMHEF0E',
    key_secret: 't4VjiCoXRhvWhHboNfyMw1go'
});


exports.createPayment = catchAsyncErrors(async (req, res, next) => {
    const { amount } = req.body;
    const payment_capture = 1;
    const options = {
        amount: amount * 100,
        currency: 'INR',
        receipt: shortid.generate(),
        payment_capture
    }

    const response = await instance.orders.create(options)

    return res.status(200).json({
        id: response.id,
        currency: response.currency,
        amount: response.amount,
        success: true
    })
})

exports.verifyPayment = catchAsyncErrors(async (req, res, next) => {
    const secret = '@Abc1234'
    const crypto = require('crypto')

    const shasum = crypto.createHmac('sha256', secret)
    shasum.update(JSON.stringify(req.body))
    const digest = shasum.digest('hex')

    if (digest === req.headers['x-razorpay-signature']) {
        return res.status(200).json({ signatureIsValid: true, success: true });
    } else {
        return res.status(400).json({ signatureIsValid: false, success: false });
    }
})