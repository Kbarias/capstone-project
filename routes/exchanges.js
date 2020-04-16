const express = require('express');
const ExchangeController = require('../controllers/exchanges');
const auth = require('../config/auth');
const router = express.Router();

router.get('/:id/:member', auth.ensureAuthenticated, ExchangeController.get_all_exchanges);

router.get('/postings/:id/:member', auth.ensureAuthenticated, ExchangeController.get_my_postings);

router.get('/bookshelf/:id/:member', auth.ensureAuthenticated, ExchangeController.get_my_bookshelf);

router.get('/history/:id/:member', auth.ensureAuthenticated, ExchangeController.get_history);

router.post('/post-book/:id/:member', auth.ensureAuthenticated, ExchangeController.post_new_book);

router.get('/textbook-details/:id/:member/:merchid', auth.ensureAuthenticated, ExchangeController.get_textbook_details);

router.get('/textbook-owner-details/:id/:member/:merchid', auth.ensureAuthenticated, ExchangeController.get_textbook_owner);

router.post('/request/:id/:member', auth.ensureAuthenticated, ExchangeController.post_request);
module.exports = router;