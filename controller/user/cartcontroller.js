const Cart = require('../../models/cart');
const catchAsyncErrors = require('../../middleware/catchAsyncErrors');
const ErrorHandler = require('../../services/errorhandler');

// function updatecart(condition, update, res) {
//     Cart.findOneAndUpdate(condition, update, {
//         upsert: true,
//         new: true
//     }).exec((err, result) => {
//         if (err) {
//             return next(new ErrorHandler(err, 400))
//         }
//         return res.status(200).json({ message: 'Updated successfully', success: true, cart: result })
//     })
// }

function runUpdate(condition, updateData) {
    return new Promise((resolve, reject) => {
        //you update code here

        Cart.findOneAndUpdate(condition, updateData, { upsert: true })
            .then((result) => resolve())
            .catch((err) => reject(err));
    });
}

module.exports.addtocart = catchAsyncErrors(async (req, res, next) => {
    Cart.findOne({ userId: req.user._id }).exec(async (error, cart) => {
        if (error) {
            return next(new ErrorHandler(error, 400))
        }
        if (cart) {
            let promiseArray = [];
            req.body.cartItems.forEach((product) => {

                const itemIndex = cart.cartItems.findIndex(cartItem => cartItem.productId == product.productId);
                //if item present then update the quanityt else add the item
                let condition, update;
                if (itemIndex > -1) {
                    condition = { userId: req.user._id, "cartItems.productId": product.productId };
                    update = {
                        $set: {
                            "cartItems.$": product
                        }
                    }
                } else {
                    condition = { userId: req.user._id };
                    update = {
                        $push: {
                            cartItems: product,
                        }
                    }
                }
                promiseArray.push(runUpdate(condition, update));
            })
            Promise.all(promiseArray)
                .then((response) => res.status(200).json({ response }))
                .catch((error) => res.status(400).json({ error }))
        } else {
            //create new cart
            cart = await Cart.create({
                userId: req.user._id,
                cartItems: req.body.cartItems
            });

            cart.save();

            return res.status(200).json({
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
        .populate("cartItems.productId", "_id itemName price image description")
        .exec((error, cart) => {
            if (error) return next(new ErrorHandler(error, 400))
            if (cart) {
                let cartItems = {};
                cart.cartItems.forEach((item, index) => {
                    console.log('item', item)
                    cartItems[item.productId._id.toString()] = {
                        _id: item.productId._id.toString(),
                        itemName: item.productId.itemName,
                        image: item.productId.image,
                        price: item.productId.price,
                        qty: item.quantity,
                        description: item.productId.description
                    };
                });
                res.status(200).json({ cartItems, success: true });
            } else {
                return res.status(200).json({ cartItems: {}, success: true })
            }
        });
    //}
};


exports.removeCartItems = catchAsyncErrors((req, res, next) => {
    const { productId } = req.body.payload;
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
            res.status(200).json({ result: result, success: true })
        })
    }
})