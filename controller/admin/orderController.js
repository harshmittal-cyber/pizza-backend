const catchAsyncErrors = require('../../middleware/catchAsyncErrors');
const ErrorHandler = require('../../services/errorhandler');
const Order = require('../../models/order');

// get order for admin
exports.getOrder = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({})
        .sort({ createdAt: -1 })
        .populate('items.productId', "itemName")
        .populate('addressId', "address");

    return res.status(200).json({ message: 'Order Fetched Successfully', success: true, orders })
})

exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
    let order = await Order.findOneAndUpdate(
        { _id: req.params.orderId, "orderStatus.type": req.body.type },
        {
            $set: {
                "orderStatus.$": [
                    { type: req.body.type, date: new Date(), isCompleted: true },
                ],
            },
        }, {
        new: true,
        runValidators: true,
        upsert: true
    }
    )

    return res.status(200).json({ message: 'Order Updated successfully', success: true, order });
})