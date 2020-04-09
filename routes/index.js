const express = require('express');
const router = express.Router();

//Welcome Page
router.get('/', (req, res) => {
    res.render('login');
});

module.exports = router;