const express = require('express');
const router = express.Router();

//Welcome Page
router.get('/', (req, res) => {
    res.render('login');
});

router.get('/disclaimer', (req, res) => {
    res.render('disclaimer', { member: req.params.name });
});
module.exports = router;