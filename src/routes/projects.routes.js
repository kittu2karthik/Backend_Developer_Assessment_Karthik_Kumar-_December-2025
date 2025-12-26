const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/projects.controller');
const authenticate = require('../middleware/auth');
const { body } = require('express-validator');
const { validate } = require('../middleware/validation');

// Validation rules
const createProjectValidation = [
  body('name').trim().notEmpty().withMessage('Project name is required'),
  body('description').optional().trim(),
  validate,
];

const updateProjectValidation = [
  body('name').optional().trim().notEmpty().withMessage('Project name cannot be empty'),
  body('description').optional().trim(),
  validate,
];

// All routes are protected
router.use(authenticate);

// Project routes
router.post('/', createProjectValidation, projectsController.createProject);
router.get('/', projectsController.getMyProjects);
router.get('/:id', projectsController.getProject);
router.put('/:id', updateProjectValidation, projectsController.updateProject);
router.delete('/:id', projectsController.deleteProject);

module.exports = router;
