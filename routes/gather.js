const express = require('express');
const GatherController = require('../controllers/gather');
const router = express.Router();
const auth = require('../config/auth');

//GATHER PAGE
router.get('/:id/:member', auth.ensureAuthenticated, GatherController.get_gather_page);

//GET MY GROUPS
router.get('/mygroups/:id/:member',  auth.ensureAuthenticated, GatherController.get_my_sessions_page);

//JOIN INVITED SESSION
router.get('/invited-join/:id/:sessionid', auth.ensureAuthenticated, GatherController.join_invited_session);

//LEAVE GROUP HANDLE
router.post('/leave-group/:id/:member/:sessionid' , auth.ensureAuthenticated, GatherController.leave_group)

//LEAVE TUTORING HANDLE
router.post('/leave-tutoring/:id/:member/:sessionid' , auth.ensureAuthenticated, GatherController.leave_tutoring)

//DELETE SESSION HANDLE
router.post('/delete/:id/:member/:sessionid', auth.ensureAuthenticated, GatherController.delete_session);

//CREATE GROUP PAGE
router.get('/create/:id/:member', auth.ensureAuthenticated , GatherController.create_group_page);

//CREATE GROUP HANDLE
router.post('/group-create/:id/:member', auth.ensureAuthenticated, GatherController.create_group);

//GROUP INFO PAGE
router.get('/group-join-info/:id/:member/:sessinfo', auth.ensureAuthenticated, GatherController.get_group_session_info);

//JOIN GATHERING HANDLE
router.get('/join/:id/:member/:sessionid', auth.ensureAuthenticated, GatherController.join_gathering);

//SESSION ORGANIZER DETAILS
router.get('/organizer-details/:id/:member/:sessionid/:edit?', auth.ensureAuthenticated, GatherController.organizer_details);
 
//EDIT SESSION
router.post('/organizer-details/edit/:id/:member/:sessionid', auth.ensureAuthenticated, GatherController.organizer_edit_details);

//CREATE TUTORING SESSION PAGE
router.get('/tutor-create/:id/:member', auth.ensureAuthenticated, GatherController.get_tutoring_page);

//CREATE TUTORING SESSION HANDLE
router.post('/tutoring-create/:id/:member', auth.ensureAuthenticated, GatherController.create_tutoring_session);

//JOIN TUTORING SESSION HANDLE
router.get('/tutor-join/:id/:member/:sessionid', auth.ensureAuthenticated, GatherController.join_tutoring_session);

//TUTORING SESSION INFO PAGE
router.get('/tutor-join-info/:id/:member/:sessinfo', auth.ensureAuthenticated, GatherController.get_tutoring_session_info);

module.exports = router; 