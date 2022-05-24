const express = require('express');
const router = express.Router();
const { createCategory, getCategories, deleteCategory, updateCategories, getCategoryForCustomer } = require('../controller/categorycontroller');
const { isAuthenticated } = require('../middleware/auth')

router.post('/create/:storeId', isAuthenticated, createCategory)
router.get('/get/:storeId', isAuthenticated, getCategories)
router.delete('/delete/:categoryId', isAuthenticated, deleteCategory);
router.put('/update/:storeId/:categoryId', isAuthenticated, updateCategories);
router.get('/getcategory', getCategoryForCustomer);


module.exports = router