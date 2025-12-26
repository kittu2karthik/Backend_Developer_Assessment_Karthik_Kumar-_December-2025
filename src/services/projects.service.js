const { Project, User } = require('../models/postgres');

const createProject = async ({ name, description, ownerId }) => {
  const project = await Project.create({
    name,
    description,
    ownerId,
  });

  return project;
};

const getProjectsByOwner = async (ownerId, { page = 1, limit = 10 }) => {
  const offset = (page - 1) * limit;

  const { count, rows } = await Project.findAndCountAll({
    where: { ownerId },
    limit,
    offset,
    include: [
      {
        model: User,
        as: 'owner',
        attributes: ['id', 'email', 'fullName'],
      },
    ],
    order: [['createdAt', 'DESC']],
  });

  return {
    projects: rows,
    pagination: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    },
  };
};

const getProjectById = async (projectId) => {
  const project = await Project.findByPk(projectId, {
    include: [
      {
        model: User,
        as: 'owner',
        attributes: ['id', 'email', 'fullName'],
      },
    ],
  });

  if (!project) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }

  return project;
};

const updateProject = async (projectId, ownerId, updates) => {
  const project = await Project.findOne({
    where: { id: projectId, ownerId },
  });

  if (!project) {
    const error = new Error('Project not found or unauthorized');
    error.statusCode = 404;
    throw error;
  }

  await project.update(updates);
  return project;
};

const deleteProject = async (projectId, ownerId) => {
  const project = await Project.findOne({
    where: { id: projectId, ownerId },
  });

  if (!project) {
    const error = new Error('Project not found or unauthorized');
    error.statusCode = 404;
    throw error;
  }

  await project.destroy();
  return { message: 'Project deleted successfully' };
};

module.exports = {
  createProject,
  getProjectsByOwner,
  getProjectById,
  updateProject,
  deleteProject,
};
