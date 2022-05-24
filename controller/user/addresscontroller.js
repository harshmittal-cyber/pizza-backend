const UserAddress = require('../../models/address');
const catchAsyncErrors = require('../../middleware/catchAsyncErrors');
const ErrorHandler = require('../../services/errorhandler');

exports.createAddress = catchAsyncErrors((req, res, next) => {
    const { address } = req.body;
    if (address) {
        if (address._id) {
            UserAddress.findOneAndUpdate(
                { userId: "6280a3d4ca6a3d32d3a6f8f1", "address._id": address._id },
                {
                    $set: {
                        "address.$": address
                    }
                }, { new: true, upsert: true }
            ).exec((err, address) => {
                if (err) {
                    return next(new ErrorHandler(err, 400))
                }
                return res.status(200).json({ address: address })
            })

        } else {
            UserAddress.findOneAndUpdate({ userId: "6280a3d4ca6a3d32d3a6f8f1" }, {
                $push: {
                    address: address
                }
            }, { new: true, upsert: true }).exec((err, address) => {
                if (err) {
                    return next(new ErrorHandler(err, 400))
                }
                return res.status(201).json({ address: address })
            })
        }

    } else {
        return next(new ErrorHandler("Address is required", 400));
    }
})

exports.getAddress = catchAsyncErrors((req, res, next) => {
    UserAddress.find({ userId: "6280a3d4ca6a3d32d3a6f8f1" }).exec((err, address) => {
        if (err) {
            return next(new ErrorHandler(err, 400))
        }
        return res.status(200).json({ message: 'Address fetched successfully', success: true, address })
    })
})