const express = require('express');
const { createAddress, getAddress } = require('../controller/user/addresscontroller');
const { isUserAuthenticated } = require('../middleware/auth');

const router = express.Router();

router.post('/createaddress', isUserAuthenticated, createAddress);
router.get('/getaddress', isUserAuthenticated, getAddress)


module.exports = router