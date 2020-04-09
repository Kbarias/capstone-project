const express = require('express');
const GatherController = require('../controllers/gather');
const router = express.Router();
const auth = require('../config/auth');

router.get('/:id/:name', auth.ensureAuthenticated, GatherController.get_gather_page);

router.get('/create/:id/:name', auth.ensureAuthenticated , GatherController.create_gathering);

router.get('/join/:id/:name', auth.ensureAuthenticated, GatherController.join_gathering);

module.exports = router;