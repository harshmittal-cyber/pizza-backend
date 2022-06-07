const express = require('express');
const { getOrder, updateOrder } = require('../controller/admin/orderController');
const { order, getOrders } = require('../controller/user/ordercontroller');
const { isUserAuthenticated, isAuthenticated } = require('../middleware/auth');
const router = express.Router();


router.post('/create', isUserAuthenticated, order)
router.get('/getOrder', isUserAuthenticated, getOrders);
router.get('/admin/getorders', getOrder);
router.put('/admin/updateOrder/:orderId', isAuthenticated, updateOrder);

module.exports = router;