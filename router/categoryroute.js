const express = require('express');
const router = express.Router();
const { createCategory } = require('../controller/categorycontroller');
const { isAuthenticated } = require('../middleware/auth')

router.post('/create/:storeId', isAuthenticated, createCategory)


module.exports = router