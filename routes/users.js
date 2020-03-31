const express = require('express');
const UserController = require('../controllers/users');
const router = express.Router();


//FORGOT PASSWORD PAGE
router.get('/recovery', UserController.get_user_recovery_request);

//FORGOT PASSWORD HANDLE
router.post('/recovery', UserController.user_recovery_request);

//FORGOT PASSWORD RESET 
router.get('/recovery/:token', UserController.get_user_password_reset);

//FORGOT PASSWORD RESET HANDLE
router.post('/recovery/reset', UserController.user_password_reset);

//REGISTER PAGE
router.get('/register', UserController.get_user_registration);

//REGISTER HANDLE
router.post('/register', UserController.user_registration);

//LOGIN PAGE
router.get('/login/:confirmation?/:token?', UserController.get_user_login);

//LOGIN HANDLE
router.post('/login', UserController.user_login);

//LOGOUT HANDLE
router.get('/logout', UserController.user_logout);

module.exports = router;