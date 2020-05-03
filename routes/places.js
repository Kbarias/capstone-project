const express = require('express');
const auth = require('../config/auth');
const Place = require('../models/Place');
const PlaceController = require('../controllers/places');

const router = express.Router();


//GET ALL PLACES
router.get('/:id/:member', auth.ensureAuthenticated, PlaceController.get_all_places);

//CREATE NEW PLACE
router.post('/create/:id/:member', auth.ensureAuthenticated, PlaceController.create_a_place);

//GET PLACE DETAILS PAGE
router.get('/wander-detail/:id/:member/:placeid', auth.ensureAuthenticated, PlaceController.get_place_detail);

//GET ADD NEW PLACE PAGE
router.get('/wander-add/:id/:member', auth.ensureAuthenticated, PlaceController.get_add_new_place_page);

//POST EDIT TO LOCATION
router.post('/edit/:id/:member/:placeid', auth.ensureAuthenticated, PlaceController.edit_place);

//GET MANAGE LOCATION PAGE FOR ADMINS
router.get('/manage-location/:id/:member/:placeid?', auth.ensureAuthenticated, PlaceController.get_manage_locations_page);

//REJECT LOCATION FOR ADMINS
router.post('/location-reject/:id/:member/:placeid', auth.ensureAuthenticated, PlaceController.reject_place);

//POST VERIFIED PLACE BY ADMIN
router.post('/verify/:id/:member/:placeid', auth.ensureAuthenticated, PlaceController.verify_place);


//router.get('/location-review/:id/:member', auth.ensureAuthenticated, PlaceController.location_review);
module.exports = router;