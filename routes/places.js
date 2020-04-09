const express = require('express');
const auth = require('../config/auth');
const Place = require('../models/Place');
const PlaceController = require('../controllers/places');

const router = express.Router();


//GET ALL PLACES
router.get('/:id/:member', auth.ensureAuthenticated, PlaceController.get_all_places);


//CREATE NEW PLACE
router.post('/create', auth.ensureAuthenticated, PlaceController.create_a_place);

module.exports = router;