const express = require('express');
const router = express.Router();
const { registerAdmin, login, logout, forgotPassword, resetPassword } = require('../controller/admin/admincontroller');


router.post('/signup', registerAdmin)
router.post('/login', login);
router.get('/logout', logout);

router.post('/forgot', forgotPassword);
router.put('/password/reset/:token', resetPassword)


module.exports = router
