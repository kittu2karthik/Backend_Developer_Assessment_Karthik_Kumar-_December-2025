const express = require('express');
const router = express.Router();
const collaboratorsController = require('../controllers/collaborators.controller');
const authenticate = require('../middleware/auth');
const { body } = require('express-validator');
const { validate } = require('../middleware/validation');

// Validation rules
const addCollaboratorValidation = [
  body('userEmail').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('role')
    .optional()
    .isIn(['Owner', 'Collaborator', 'Viewer'])
    .withMessage('Role must be Owner, Collaborator, or Viewer'),
  validate,
];

const updateRoleValidation = [
  body('role')
    .isIn(['Owner', 'Collaborator', 'Viewer'])
    .withMessage('Role must be Owner, Collaborator, or Viewer'),
  validate,
];

// All routes are protected
router.use(authenticate);

// Collaborator routes
router.post(
  '/workspace/:workspaceId',
  addCollaboratorValidation,
  collaboratorsController.addCollaborator
);
router.get('/workspace/:workspaceId', collaboratorsController.getCollaborators);
router.put(
  '/workspace/:workspaceId/:collaboratorId',
  updateRoleValidation,
  collaboratorsController.updateRole
);
router.delete(
  '/workspace/:workspaceId/:collaboratorId',
  collaboratorsController.removeCollaborator
);

module.exports = router;
