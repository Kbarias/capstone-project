const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

//Welcome Page
router.get('/', (req, res) => {
    res.render('login');
});


//Dashboard Page
router.get('/dashboard', ensureAuthenticated, (req, res) =>
    res.render('dashboard1', {
        name: req.user.name //fix
    }));

module.exports = router;