const express = require('express');
const router = express.Router();
const { addtocart, getCartItems, removeCartItems } = require('../controller/user/cartcontroller');
const { isUserAuthenticated } = require('../middleware/auth');

router.post('/addtocart', isUserAuthenticated, addtocart);
router.get('/getcart', isUserAuthenticated, getCartItems);
router.post('/removeitem', isUserAuthenticated, removeCartItems);

module.exports = router