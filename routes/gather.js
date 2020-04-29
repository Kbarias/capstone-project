const express = require('express');
const GatherController = require('../controllers/gather');
const router = express.Router();
const auth = require('../config/auth');

router.get('/:id/:member', auth.ensureAuthenticated, GatherController.get_gather_page);

router.get('/create/:id/:member', auth.ensureAuthenticated , GatherController.create_gathering_page);

router.post('/group-create/:id/:member', auth.ensureAuthenticated, GatherController.create_group_session);

router.get('/group-join-info/:id/:member/:sessinfo?', auth.ensureAuthenticated, GatherController.get_group_session_info);

router.get('/join/:id/:member', auth.ensureAuthenticated, GatherController.join_gathering);
 
router.get('/tutor-create/:id/:member', auth.ensureAuthenticated, GatherController.get_tutoring_session_page);

router.post('/tutoring-create/:id/:member', auth.ensureAuthenticated, GatherController.create_tutoring_session);

router.get('/tutor-join/:id/:member/:sessionid', auth.ensureAuthenticated, GatherController.join_tutoring_session);

router.get('/tutor-join-info/:id/:member/:sessinfo?', auth.ensureAuthenticated, GatherController.get_tutoring_session_info);
module.exports = router; 