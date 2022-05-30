const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const Cart = require("../../models/cart");
const Order = require('../../models/order')

module.exports.order = catchAsyncErrors(async (req, res, next) => {
    let result = await Cart.findOne({ userId: req.user._id });
    if (result) {
        req.body.userId = req.user._id;
        req.body.orderStatus = [
            {
                type: "ordered",
                date: new Date(),
                isCompleted: true,
            }, {
                type: "baking",
                isCompleted: false,
            }, {
                type: "shipped",
                isCompleted: false,
            }, {
                type: "delivered",
                isCompleted: false,
            },
            {
                type: 'cancelled',
                isCompleted: false,
            }
        ]

        req.body.orderId = `${process.env.ORDER_ID_SECRET}${Math.floor(Math.random() * 10000000000000000)}`;

        const order = await Order.create(req.body);

        await order.save();

        await Cart.deleteOne({ userId: req.user._id });

        return res.status(200).json({ message: 'Order Placed Successfully', success: true, order })
    }
})

exports.getOrders = catchAsyncErrors(async (req, res, next) => {
    let order = await Order.find({ userId: req.user._id })
        .populate("items.productId", "_id itemName image price")
        .populate('addressId', 'address')
        .sort("-createdAt")
    return res.status(200).json({ message: 'Orders Fetched Successfully', success: true, order })
})