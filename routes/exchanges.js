const express = require('express');
const ExchangeController = require('../controllers/exchanges');
const auth = require('../config/auth');
const router = express.Router();

//EXCHANGES PAGE
router.get('/:id/:member', auth.ensureAuthenticated, ExchangeController.get_all_exchanges);

//POST BOOK PAGE
router.get('/postings/:id/:member', auth.ensureAuthenticated, ExchangeController.get_post_a_book_page);

//POST BOOK HANDLE
router.post('/post-book/:id/:member', auth.ensureAuthenticated, ExchangeController.post_new_book);

//MY BOOK POSTINGS PAGE
router.get('/myposts/:id/:member', auth.ensureAuthenticated, ExchangeController.get_myposts);

//POST BOOK BACK TO EXCHANGE
router.get('/repostbook/:id/:member/:merchid', auth.ensureAuthenticated, ExchangeController.book_repost);

//DELETE BOOK POST
router.get('/deletepost/:id/:member/:merchid', auth.ensureAuthenticated, ExchangeController.delete_book_post);

//MY BOOKSHELF HANDLE
router.get('/bookshelf/:id/:member', auth.ensureAuthenticated, ExchangeController.get_my_bookshelf);

//MY HISTORY HANDLE
router.get('/history/:id/:member', auth.ensureAuthenticated, ExchangeController.get_history);

//EDIT TEXTBOOK PAGE
router.get('/textbook-edit/:id/:member/:merchid' , auth.ensureAuthenticated, ExchangeController.get_edit_textbook_page);

//POST TEXTBOOK EDITS
router.post('/textbook-edit-post/:id/:member/:merchid', auth.ensureAuthenticated, ExchangeController.post_textbook_edits)

//GET TEXTBOOK DETAILS
router.get('/textbook-details/:id/:member/:merchid', auth.ensureAuthenticated, ExchangeController.get_textbook_details);

//GET TEXTBOOK DETAILS FOR OWNER
router.get('/textbook-owner-details/:id/:member/:merchid', auth.ensureAuthenticated, ExchangeController.owner_get_textbook);

//POST REQUEST HANDLE
router.post('/request/:id/:member/:merchid', auth.ensureAuthenticated, ExchangeController.post_request);

//ACCEPT REQUEST HANDLE
router.post('/accept-request/:id/:member/:merchid', auth.ensureAuthenticated, ExchangeController.accept_request);

//DELETE REQUEST HANDLE
router.get('/request/delete/:id/:member/:requestid', auth.ensureAuthenticated, ExchangeController.delete_request);
module.exports = router;