const { Workspace, Project, Collaborator, User } = require('../models/postgres');

const createWorkspace = async ({ projectId, name, description, settings, userId }) => {
  // Verify user owns the project
  const project = await Project.findOne({
    where: { id: projectId, ownerId: userId },
  });

  if (!project) {
    const error = new Error('Project not found or unauthorized');
    error.statusCode = 404;
    throw error;
  }

  const workspace = await Workspace.create({
    projectId,
    name,
    description,
    settings: settings || {},
  });

  return workspace;
};

const getWorkspacesByProject = async (projectId, userId) => {
  // Verify user owns the project
  const project = await Project.findByPk(projectId);

  if (!project) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }

  const workspaces = await Workspace.findAll({
    where: { projectId },
    include: [
      {
        model: Project,
        as: 'project',
        attributes: ['id', 'name'],
      },
    ],
    order: [['createdAt', 'DESC']],
  });

  return workspaces;
};

const getWorkspaceById = async (workspaceId) => {
  const workspace = await Workspace.findByPk(workspaceId, {
    include: [
      {
        model: Project,
        as: 'project',
        include: [
          {
            model: User,
            as: 'owner',
            attributes: ['id', 'email', 'fullName'],
          },
        ],
      },
    ],
  });

  if (!workspace) {
    const error = new Error('Workspace not found');
    error.statusCode = 404;
    throw error;
  }

  return workspace;
};

const updateWorkspace = async (workspaceId, userId, updates) => {
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

  // Check if user owns the project
  if (workspace.project.ownerId !== userId) {
    const error = new Error('Unauthorized');
    error.statusCode = 403;
    throw error;
  }

  await workspace.update(updates);
  return workspace;
};

const deleteWorkspace = async (workspaceId, userId) => {
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

  // Check if user owns the project
  if (workspace.project.ownerId !== userId) {
    const error = new Error('Unauthorized');
    error.statusCode = 403;
    throw error;
  }

  await workspace.destroy();
  return { message: 'Workspace deleted successfully' };
};

module.exports = {
  createWorkspace,
  getWorkspacesByProject,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
};
