const express = require('express');
const router = express.Router();
const { addtocart, getCartItems, removeCartItems } = require('../controller/user/cartcontroller');

router.post('/addtocart', addtocart);
router.get('/getcart', getCartItems);
router.post('/removeitem', removeCartItems);

module.exports = router