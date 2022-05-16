const Cart = require('../../models/cart');
const catchAsyncErrors = require('../../middleware/catchAsyncErrors');
const ErrorHandler = require('../../services/errorhandler');

function updatecart(condition, update, res) {
    Cart.findOneAndUpdate(condition, update, {
        upsert: true,
        new: true
    }).exec((err, result) => {
        if (err) {
            return next(new ErrorHandler(err, 400))
        }
        return res.status(200).json({ message: 'Updated successfully', success: true, cart: result })
    })
}

module.exports.addtocart = catchAsyncErrors(async (req, res, next) => {
    Cart.findOne({ userId: req.user._id }).exec(async (error, cart) => {
        if (error) {
            return next(new ErrorHandler(error, 400))
        }
        if (cart) {
            const item = req.body.cartItem
            const product = item.productId;
            const itemIndex = cart.cartItems.findIndex(cartItem => cartItem.productId == product);
            //if item present then update the quanityt else add the item
            let condition, update;
            if (itemIndex > -1) {
                condition = { userId: req.user._id, "cartItems.productId": product };
                update = {
                    $set: {
                        "cartItems.$": item
                    }
                }
                updatecart(condition, update, res);
            } else {
                condition = { userId: req.user._id };
                update = {
                    $push: {
                        cartItems: item,
                    }
                }
                updatecart(condition, update, res);
            }
        } else {
            //create new cart
            cart = await Cart.create({
                userId: req.user._id,
                cartItems: req.body.cartItems
            });

            cart.save();

            return res.status(201).json({
                success: true,
                message: 'Item added to cart successfully',
                cart
            })
        }
    });
})

exports.getCartItems = (req, res) => {
    //const { user } = req.body.payload;
    //if(user){
    Cart.findOne({ userId: req.user._id })
        .populate("cartItems.productId", "_id itemName price image")
        .exec((error, cart) => {
            if (error) return next(new ErrorHandler(error, 400))
            if (cart) {
                let cartItems = {};
                cart.cartItems.forEach((item, index) => {
                    cartItems[item.productId._id.toString()] = {
                        _id: item.productId._id.toString(),
                        name: item.productId.itemName,
                        img: item.productId.image,
                        price: item.productId.price,
                        qty: item.quantity,
                    };
                });
                res.status(200).json({ cartItems });
            }
        });
    //}
};


exports.removeCartItems = catchAsyncErrors((req, res, next) => {
    const { productId } = req.body;
    if (productId) {
        Cart.findOneAndUpdate({
            userId: req.user._id
        }, {
            $pull: {
                cartItems: {
                    productId: productId
                }
            }
        }
        ).exec((error, result) => {
            if (error) {
                return next(new new ErrorHandler(error, 400))
            }
            res.status(200).json({ res: result })
        })
    }
})