const express = require('express');
const auth = require('../config/auth');
const Place = require('../models/Place');
const PlaceController = require('../controllers/places');

const router = express.Router();


//GET ALL PLACES
router.get('/:id/:member', auth.ensureAuthenticated, PlaceController.get_all_places);

//CREATE NEW PLACE
router.post('/create', auth.ensureAuthenticated, PlaceController.create_a_place);

router.get('/wander-detail/:id/:member', auth.ensureAuthenticated, PlaceController.get_create_place_page);

router.get('/wander-add/:id/:member', auth.ensureAuthenticated, PlaceController.add_new_place);

module.exports = router;