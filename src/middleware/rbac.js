const { Collaborator, Workspace, User, Project } = require('../models/postgres');

// Check if user has required role
const checkWorkspaceAccess = async (workspaceId, userId, requiredRole = null) => {
  // First check if user owns the project
  const workspace = await Workspace.findByPk(workspaceId, {
    include: [
      {
        model: Project,
        as: 'project',
      },
    ],
  });

  if (!workspace) {
    const error = new Error('Workspace not found');
    error.statusCode = 404;
    throw error;
  }

  // Owner has all permissions
  if (workspace.project.ownerId === userId) {
    return { role: 'Owner', workspace };
  }

  // Check collaborator role
  const collaborator = await Collaborator.findOne({
    where: { workspaceId, userId },
  });

  if (!collaborator) {
    const error = new Error('Access denied');
    error.statusCode = 403;
    throw error;
  }

  // Check if user has required role
  if (requiredRole) {
    const roleHierarchy = { Owner: 3, Collaborator: 2, Viewer: 1 };
    const userRoleLevel = roleHierarchy[collaborator.role];
    const requiredRoleLevel = roleHierarchy[requiredRole];

    if (userRoleLevel < requiredRoleLevel) {
      const error = new Error('Insufficient permissions');
      error.statusCode = 403;
      throw error;
    }
  }

  return { role: collaborator.role, workspace };
};

module.exports = (requiredRole = null) => {
  return async (req, res, next) => {
    try {
      const workspaceId = req.params.workspaceId || req.body.workspaceId;

      if (!workspaceId) {
        const error = new Error('Workspace ID is required');
        error.statusCode = 400;
        throw error;
      }

      const result = await checkWorkspaceAccess(workspaceId, req.user.id, requiredRole);

      // Attach workspace access info to request
      req.workspaceAccess = result;

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports.checkWorkspaceAccess = checkWorkspaceAccess;
