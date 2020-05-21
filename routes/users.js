const express = require('express');
const UserController = require('../controllers/users');
const router = express.Router();


//ADD ADMIN
router.get('/admin-invite/:id', UserController.become_an_admin);

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

//DELETE USER HANDLE
router.post('/delete/:userid/:id?/:member?/:admin?', UserController.delete_user);

//CHANGE USER ROLE/ BLOCK OR UNBLOCK USER
router.post('/:id/:member/role/:userid', UserController.edit_user);


//EDIT PROFILE PAGE
router.get('/user-profile/:id/:member', UserController.get_edit_profile_page);

//EDIT PROFILE HANDLE
router.post('/edit-profile/:id/:member', UserController.edit_profile);

//USER RATING PAGE
router.get('/rating/:id/:member/:user', UserController.get_rating_page);

//USER RATING POST
router.post('/leave-rating/:id/:member/:user', UserController.rating_post);

module.exports = router;