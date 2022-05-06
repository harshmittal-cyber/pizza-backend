const express = require('express');
const router = express.Router();
const { createCategory, getCategories, deleteCategory, updateCategories } = require('../controller/categorycontroller');
const { isAuthenticated } = require('../middleware/auth')

router.post('/create/:storeId', isAuthenticated, createCategory)
router.get('/get/:storeId', isAuthenticated, getCategories)
router.delete('/delete/:categoryId', isAuthenticated, deleteCategory);
router.put('/update/:storeId/:categoryId', isAuthenticated, updateCategories)


module.exports = router