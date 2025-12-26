const User = require('./User');
const Project = require('./Project');
const Workspace = require('./Workspace');
const Collaborator = require('./Collaborator');

// Define associations
User.hasMany(Project, { foreignKey: 'ownerId', as: 'projects' });
Project.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

Project.hasMany(Workspace, { foreignKey: 'projectId', as: 'workspaces' });
Workspace.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

Workspace.hasMany(Collaborator, { foreignKey: 'workspaceId', as: 'collaborators' });
Collaborator.belongsTo(Workspace, { foreignKey: 'workspaceId', as: 'workspace' });

User.hasMany(Collaborator, { foreignKey: 'userId', as: 'collaborations' });
Collaborator.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  User,
  Project,
  Workspace,
  Collaborator,
};
