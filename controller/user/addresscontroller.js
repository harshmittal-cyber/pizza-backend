const UserAddress = require('../../models/address');
const catchAsyncErrors = require('../../middleware/catchAsyncErrors');
const ErrorHandler = require('../../services/errorhandler');

// exports.createAddress = catchAsyncErrors((req, res, next) => {
//     const { address } = req.body;

//     if (address) {
//         if (address._id) {
//             UserAddress.findOneAndUpdate(
//                 { userId: req.user._id, "address._id": address._id },
//                 {
//                     $set: {
//                         "address.$": address
//                     }
//                 }, { new: true, upsert: true }
//             ).exec((err, address) => {
//                 if (err) {
//                     return next(new ErrorHandler(err, 400))
//                 }
//                 return res.status(200).json({ address: address })
//             })

//         } else {
//             UserAddress.findOneAndUpdate({ userId: req.user._id }, {
//                 $push: {
//                     address: address
//                 }
//             }, { new: true, upsert: true }).exec((err, address) => {
//                 if (err) {
//                     return next(new ErrorHandler(err, 400))
//                 }
//                 return res.status(201).json({ address: address })
//             })
//         }

//     } else {
//         return next(new ErrorHandler("Address is required", 400));
//     }
// })

exports.createAddress = catchAsyncErrors(async (req, res, next) => {
    const { address } = req.body;

    if (!address) {
        return next(new ErrorHandler("Address is required", 400))
    }
    console.log('add', address)
    if (address._id) {
        UserAddress.findOneAndUpdate({ userId: req.user._id }, {
            $set: {
                "address.$": address
            }
        }, { new: true, upsert: true }
        ).exec((err, address) => {
            if (err) {
                return next(new ErrorHandler(err, 400))
            }
            return res.status(200).json({ address })
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