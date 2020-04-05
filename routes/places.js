const express = require('express');
const Place = require('../models/Place');
const PlaceController = require('../controllers/places');

const router = express.Router();


//GET ALL PLACES
router.get('/:id/:member', PlaceController.get_all_places);


//CREATE NEW PLACE
router.post('/create', PlaceController.create_a_place);

module.exports = router;