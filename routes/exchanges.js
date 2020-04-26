const express = require('express');
const ExchangeController = require('../controllers/exchanges');
const auth = require('../config/auth');
const router = express.Router();

router.get('/:id/:member', auth.ensureAuthenticated, ExchangeController.get_all_exchanges);

router.get('/postings/:id/:member', auth.ensureAuthenticated, ExchangeController.get_post_a_book_page);

router.get('/bookshelf/:id/:member', auth.ensureAuthenticated, ExchangeController.get_my_bookshelf);

router.get('/history/:id/:member', auth.ensureAuthenticated, ExchangeController.get_history);

router.post('/post-book/:id/:member', auth.ensureAuthenticated, ExchangeController.post_new_book);

router.get('/myposts/:id/:member', auth.ensureAuthenticated, ExchangeController.get_myposts);

router.get('/textbook-details/:id/:member/:merchid', auth.ensureAuthenticated, ExchangeController.get_textbook_details);

router.get('/textbook-owner-details/:id/:member/:merchid', auth.ensureAuthenticated, ExchangeController.owner_get_textbook);

router.post('/request/:id/:member/:merchid', auth.ensureAuthenticated, ExchangeController.post_request);

router.get('/request/delete/:id/:member/:requestid', auth.ensureAuthenticated, ExchangeController.delete_request);
module.exports = router;