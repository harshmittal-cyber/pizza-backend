const express = require('express');
const { contact } = require('../controller/user/contactus');
const { sendOtp, verifyOtp } = require('../controller/user/usercontroller');
const router = express.Router();

router.post('/sendotp', sendOtp)
router.post('/verifyotp', verifyOtp);
router.post('/enquiry', contact)

module.exports = router;