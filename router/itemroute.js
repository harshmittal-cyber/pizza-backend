const express = require('express');
const { createItem, deleteItem, updateItem } = require('../controller/itemcontroller');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth')


router.post('/create/:storeId', isAuthenticated, createItem);
router.delete('/delete/:id', isAuthenticated, deleteItem);
router.put('/update/:id', isAuthenticated, updateItem)


module.exports = router