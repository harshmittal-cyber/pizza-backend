const UserAddress = require('../../models/address');
const catchAsyncErrors = require('../../middleware/catchAsyncErrors');
const ErrorHandler = require('../../services/errorhandler');

exports.createAddress = catchAsyncErrors(async (req, res, next) => {
    const { address } = req.body;

    if (!address) {
        return next(new ErrorHandler("Address is required", 400))
    }

    let editaddress = await UserAddress.findOne({ user: req.user._id });
    if (editaddress !== null) {
        UserAddress.findOneAndUpdate({ userId: req.user._id }, {
            $set: {
                address: address
            }
        }, { new: true, upsert: true }
        ).exec((err, address) => {
            if (err) {
                return next(new ErrorHandler(err, 400))
            }
            return res.status(200).json({ message: 'Address Update successfully', success: true, address })
        })
    } else {

        const address1 = await new UserAddress({ address: address, userId: req.user._id });
        await address1.save();

        return res.status(201).json({ address: address1, message: "Address created successfully", success: true })

    }

})

exports.getAddress = catchAsyncErrors((req, res, next) => {
    UserAddress.findOne({ userId: req.user._id }).exec((err, address) => {
        if (err) {
            return next(new ErrorHandler(err, 400))
        }
        return res.status(200).json({ message: 'Address fetched successfully', success: true, address })
    })
})