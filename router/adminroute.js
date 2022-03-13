const express = require('express');
const router = express.Router();
const { registerAdmin, login } = require('../controller/admincontroller');


router.post('/signup', registerAdmin)
router.post('/login', login)


module.exports = router
