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
router.get('/wander/:name', (req, res) => {
    res.render('wander', { member: req.params.name });
});

router.get('/dashboard-user/:name', (req, res) => {
    res.render('dashboard-user', { member: req.params.name });
});

router.get('/dashboard-admin/:name', (req, res) => {
    res.render('dashboard-admin', { member: req.params.name });
});
router.get('/manage-location/:name', (req, res) => {
    res.render('manage-location', { member: req.params.name });
});
router.get('/location-review/:name', (req, res) => {
    res.render('location-review', { member: req.params.name });
});
router.get('/exchange/:name', (req, res) => {
    res.render('exchange', { member: req.params.name });
});
router.get('/bookshelf/:name', (req, res) => {
    res.render('bookshelf', { member: req.params.name });
});
router.get('/textbook-details/:name', (req, res) => {
    res.render('textbook-details', { member: req.params.name });
});
router.get('/textbook-owner-details/:name', (req, res) => {
    res.render('textbook-owner-details', { member: req.params.name });
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
router.get('/tutor-create/:name', (req, res) => {
    res.render('tutor-create', { member: req.params.name });
});
router.get('/tutor-join/:name', (req, res) => {
    res.render('tutor-join', { member: req.params.name });
});
router.get('/wander-detail/:name', (req, res) => {
    res.render('wander-detail', { member: req.params.name });
});
router.get('/wander-add/:name', (req, res) => {
    res.render('wander-add', { member: req.params.name });
});
router.get('/user-profile/:name', (req, res) => {
    res.render('user-profile', { member: req.params.name });
});
router.get('/disclaimer', (req, res) => {
    res.render('disclaimer', { member: req.params.name });
});
module.exports = router;