const express = require('express');
const DashboardController = require('../controllers/dashboard');
const router = express.Router();
const auth = require('../config/auth');

//Dashboard Page
router.get('/admin/:id/:member/:userinfo?', auth.isAdminDashboard, DashboardController.get_admin_dashboard_page);

router.get('/member/:id/:member', auth.ensureAuthenticated, DashboardController.get_member_dashboard_page);


module.exports = router;
