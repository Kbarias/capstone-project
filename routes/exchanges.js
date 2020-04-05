const express = require('express');
const ExchangeController = require('../controllers/exchanges');
const auth = require('../config/auth');
const router = express.Router();

router.get('/:id/:member', auth.ensureAuthenticated, ExchangeController.get_all_exchanges);

module.exports = router;