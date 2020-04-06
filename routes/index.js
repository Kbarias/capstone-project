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

router.get('/dashboard-places/:name', (req, res) => {
    res.render('dashboard-places', { member: req.params.name });
});



router.get('/dashboard-admin/:name', (req, res) => {
    res.render('dashboard-admin', { member: req.params.name });
});

router.get('/exchange/:name', (req, res) => {
    res.render('exchange', { member: req.params.name });
});
router.get('/bookshelf/:name', (req, res) => {
    res.render('bookshelf', { member: req.params.name });
});
router.get('/history/:name', (req, res) => {
    res.render('history', { member: req.params.name });
});
router.get('/gather/:name', (req, res) => {
    res.render('gather', { member: req.params.name });
});
router.get('/gather-create/:name', (req, res) => {
    res.render('gather-create', { member: req.params.name });
});
router.get('/gather-join/:name', (req, res) => {
    res.render('gather-join', { member: req.params.name });
});
module.exports = router;