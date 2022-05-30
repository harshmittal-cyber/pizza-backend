const express = require('express');
const { order, getOrders } = require('../controller/user/ordercontroller');
const { isUserAuthenticated } = require('../middleware/auth');
const router = express.Router();


router.post('/create', isUserAuthenticated, order)
router.get('/getOrder', isUserAuthenticated, getOrders)
module.exports = router;