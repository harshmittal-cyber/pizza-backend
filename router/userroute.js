const express = require('express');
const { sendOtp, verifyOtp } = require('../controller/user/usercontroller');
const router = express.Router();

router.post('/sendotp', sendOtp)
router.post('/verifyotp', verifyOtp);

module.exports = router;