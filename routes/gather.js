const express = require('express');
const GatherController = require('../controllers/gather');
const router = express.Router();
const auth = require('../config/auth');

router.get('/:id/:member', auth.ensureAuthenticated, GatherController.get_gather_page);

router.get('/create/:id/:member', auth.ensureAuthenticated , GatherController.create_gathering);

router.get('/join/:id/:member', auth.ensureAuthenticated, GatherController.join_gathering);
 
module.exports = router;