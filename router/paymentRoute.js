const express = require('express');
const { createPayment, verifyPayment } = require('../controller/user/paymentController');
const { isUserAuthenticated } = require('../middleware/auth');
const router = express.Router();

router.post('/createpayment', isUserAuthenticated, createPayment)
router.post('/verifypayment', verifyPayment)

module.exports = router;