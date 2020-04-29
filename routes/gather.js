const express = require('express');
const GatherController = require('../controllers/gather');
const router = express.Router();
const auth = require('../config/auth');

router.get('/:id/:member', auth.ensureAuthenticated, GatherController.get_gather_page);

router.get('/invited-join/:id/:sessionid', auth.ensureAuthenticated, GatherController.join_invited_session);

router.post('/leave-group/:id/:member/:sessionid' , auth.ensureAuthenticated, GatherController.leave_group)

router.post('/leave-tutoring/:id/:member/:sessionid' , auth.ensureAuthenticated, GatherController.leave_tutoring)

router.post('/delete/:id/:member/:sessionid', auth.ensureAuthenticated, GatherController.delete_session);

router.get('/create/:id/:member', auth.ensureAuthenticated , GatherController.create_group_page);

router.post('/group-create/:id/:member', auth.ensureAuthenticated, GatherController.create_group);

router.get('/group-join-info/:id/:member/:sessinfo?', auth.ensureAuthenticated, GatherController.get_group_session_info);

router.get('/join/:id/:member/:sessionid', auth.ensureAuthenticated, GatherController.join_gathering);

router.get('/organizer-details/:id/:member/:sessionid/:edit?', auth.ensureAuthenticated, GatherController.organizer_details);
 
router.post('/organizer-details/edit/:id/:member/:sessionid', auth.ensureAuthenticated, GatherController.organizer_edit_details);

router.get('/tutor-create/:id/:member', auth.ensureAuthenticated, GatherController.get_tutoring_page);

router.post('/tutoring-create/:id/:member', auth.ensureAuthenticated, GatherController.create_tutoring_session);

router.get('/tutor-join/:id/:member/:sessionid', auth.ensureAuthenticated, GatherController.join_tutoring_session);

router.get('/tutor-join-info/:id/:member/:sessinfo?', auth.ensureAuthenticated, GatherController.get_tutoring_session_info);
module.exports = router; 