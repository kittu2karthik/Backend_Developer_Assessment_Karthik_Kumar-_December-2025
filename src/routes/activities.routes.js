const express = require('express');
const router = express.Router();
const activitiesController = require('../controllers/activities.controller');
const authenticate = require('../middleware/auth');

// All routes are protected
router.use(authenticate);

// Activity routes
router.get('/workspace/:workspaceId', activitiesController.getWorkspaceActivities);
router.get('/me', activitiesController.getUserActivities);

module.exports = router;
