const { Collaborator, User, Workspace, Project } = require('../models/postgres');
const { checkWorkspaceAccess } = require('../middleware/rbac');

const addCollaborator = async ({ workspaceId, userEmail, role, requestUserId }) => {
  // Verify requester has Owner or Collaborator role
  const access = await checkWorkspaceAccess(workspaceId, requestUserId, 'Collaborator');

  // Find user to add
  const user = await User.findOne({ where: { email: userEmail } });
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  // Check if user is already a collaborator
  const existing = await Collaborator.findOne({
    where: { workspaceId, userId: user.id },
  });

  if (existing) {
    const error = new Error('User is already a collaborator');
    error.statusCode = 400;
    throw error;
  }

  // Create collaborator
  const collaborator = await Collaborator.create({
    workspaceId,
    userId: user.id,
    role: role || 'Viewer',
  });

  // Return with user details
  const result = await Collaborator.findByPk(collaborator.id, {
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'fullName'],
      },
    ],
  });

  return result;
};

const getWorkspaceCollaborators = async (workspaceId, requestUserId) => {
  // Verify requester has access
  await checkWorkspaceAccess(workspaceId, requestUserId);

  const collaborators = await Collaborator.findAll({
    where: { workspaceId },
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'fullName'],
      },
    ],
    order: [['createdAt', 'DESC']],
  });

  return collaborators;
};

const updateCollaboratorRole = async ({ workspaceId, collaboratorId, newRole, requestUserId }) => {
  // Verify requester is Owner
  await checkWorkspaceAccess(workspaceId, requestUserId, 'Owner');

  const collaborator = await Collaborator.findOne({
    where: { id: collaboratorId, workspaceId },
  });

  if (!collaborator) {
    const error = new Error('Collaborator not found');
    error.statusCode = 404;
    throw error;
  }

  // Update role
  await collaborator.update({ role: newRole });

  // Return with user details
  const result = await Collaborator.findByPk(collaborator.id, {
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'fullName'],
      },
    ],
  });

  return result;
};

const removeCollaborator = async ({ workspaceId, collaboratorId, requestUserId }) => {
  // Verify requester is Owner
  await checkWorkspaceAccess(workspaceId, requestUserId, 'Owner');

  const collaborator = await Collaborator.findOne({
    where: { id: collaboratorId, workspaceId },
  });

  if (!collaborator) {
    const error = new Error('Collaborator not found');
    error.statusCode = 404;
    throw error;
  }

  await collaborator.destroy();

  return { message: 'Collaborator removed successfully' };
};

module.exports = {
  addCollaborator,
  getWorkspaceCollaborators,
  updateCollaboratorRole,
  removeCollaborator,
};
