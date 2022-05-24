const express = require('express');
const { createAddress, getAddress } = require('../controller/user/addresscontroller');
const router = express.Router();

router.post('/createaddress', createAddress);
router.get('/getaddress', getAddress)


module.exports = router