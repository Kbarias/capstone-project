const express = require('express');
const router = express.Router();

//Welcome Page
router.get('/', (req, res) => {
    res.render('login');
});

router.get('/manage-location/:name', (req, res) => {
    res.render('manage-location', { member: req.params.name });
});
router.get('/location-review/:name', (req, res) => {
    res.render('location-review', { member: req.params.name });
});

router.get('/user-profile/:name', (req, res) => {
    res.render('user-profile', { member: req.params.name });
});
router.get('/disclaimer', (req, res) => {
    res.render('disclaimer', { member: req.params.name });
});
module.exports = router;