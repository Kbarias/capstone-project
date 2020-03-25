const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

//Welcome Page
router.get('/', (req, res) => {
    res.render('login');
});


//Dashboard Page
// router.get('/dashboard', ensureAuthenticated, (req, res) =>
//     res.render('dashboard', {
//         name: req.user.name //fix
//     }));

//dashboard has to follow by a username, otherwise, page won't load
router.get('/dashboard/:name', (req, res) => {
    res.render('dashboard1', { member: req.params.name });
});

router.get('/dashboard_places/:name', (req, res) => {
    res.render('dashboard_places', { member: req.params.name });
});
module.exports = router;