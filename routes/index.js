const express = require('express');
const router = express.Router();

//Welcome Page
router.get('/', (req, res) => {
    res.render('login');
});


// router.get('/bookshelf/:name', (req, res) => {
//     res.render('bookshelf', { member: req.params.name });
// });
// router.get('/history/:name', (req, res) => {
//     res.render('history', { member: req.params.name });
// });
module.exports = router;