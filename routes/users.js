const express = require('express');
const User = require('../models/User');
const UserInfo = require('../models/UserInfo');

const router = express.Router();

//Login Page
router.get('/login', (req, res) => {
    res.send('Login Page');
});

//Register Page
router.get('/register', (req, res) => {
    res.send('Register Page');
});

//Register Handle
router.post('/register', (req,res) => {
    const user = new User({
        user_name: req.body.user_name,
        user_pw: req.body.user_pw,
        full_name: req.body.full_name,
        email: req.body.email,
        is_admin: req.body.is_admin
    });

    user.save()
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.json({ message: err });
        });

    //create userInfo document for this new user
    const userinfo = new UserInfo({
        _id: user.id,
    });

    userinfo.save()
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.json({ message: err });
        });

});

module.exports = router;