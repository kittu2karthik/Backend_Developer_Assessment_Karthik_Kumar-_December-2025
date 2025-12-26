const express = require('express');
const router = express.Router();
const workspacesController = require('../controllers/workspaces.controller');
const authenticate = require('../middleware/auth');
const { body } = require('express-validator');
const { validate } = require('../middleware/validation');

// Validation rules
const createWorkspaceValidation = [
  body('projectId').isUUID().withMessage('Valid project ID is required'),
  body('name').trim().notEmpty().withMessage('Workspace name is required'),
  body('description').optional().trim(),
  body('settings').optional().isObject().withMessage('Settings must be an object'),
  validate,
];

const updateWorkspaceValidation = [
  body('name').optional().trim().notEmpty().withMessage('Workspace name cannot be empty'),
  body('description').optional().trim(),
  body('settings').optional().isObject().withMessage('Settings must be an object'),
  validate,
];

// All routes are protected
router.use(authenticate);

// Workspace routes
router.post('/', createWorkspaceValidation, workspacesController.createWorkspace);
router.get('/project/:projectId', workspacesController.getWorkspacesByProject);
router.get('/:id', workspacesController.getWorkspace);
router.put('/:id', updateWorkspaceValidation, workspacesController.updateWorkspace);
router.delete('/:id', workspacesController.deleteWorkspace);

module.exports = router;
