const express = require('express');
const router = express.Router();
const jobsController = require('../controllers/jobs.controller');
const authenticate = require('../middleware/auth');
const { body } = require('express-validator');
const { validate } = require('../middleware/validation');

// Validation rules
const codeExecutionValidation = [
  body('code').trim().notEmpty().withMessage('Code is required'),
  body('language')
    .isIn(['javascript', 'python', 'java', 'cpp', 'go'])
    .withMessage('Invalid language'),
  body('workspaceId').isUUID().withMessage('Valid workspace ID is required'),
  validate,
];

const emailValidation = [
  body('to').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('body').trim().notEmpty().withMessage('Body is required'),
  body('type').isIn(['notification', 'invite', 'report']).withMessage('Invalid email type'),
  validate,
];

const reportValidation = [
  body('reportType').isIn(['activity', 'analytics', 'summary']).withMessage('Invalid report type'),
  body('workspaceId').isUUID().withMessage('Valid workspace ID is required'),
  body('dateRange').optional().isObject().withMessage('Date range must be an object'),
  validate,
];

// All routes are protected
router.use(authenticate);

// Job routes
router.post('/execute-code', codeExecutionValidation, jobsController.executeCode);
router.post('/send-email', emailValidation, jobsController.sendEmail);
router.post('/generate-report', reportValidation, jobsController.generateReport);
router.get('/:queueName/:jobId', jobsController.getJobStatus);

module.exports = router;
