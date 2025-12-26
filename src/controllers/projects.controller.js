const projectsService = require('../services/projects.service');

const createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const ownerId = req.user.id;

    const project = await projectsService.createProject({
      name,
      description,
      ownerId,
    });

    res.status(201).json({
      success: true,
      data: { project },
    });
  } catch (error) {
    next(error);
  }
};

const getMyProjects = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const result = await projectsService.getProjectsByOwner(req.user.id, {
      page: parseInt(page),
      limit: parseInt(limit),
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    const project = await projectsService.getProjectById(id);

    res.json({
      success: true,
      data: { project },
    });
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const project = await projectsService.updateProject(id, req.user.id, {
      name,
      description,
    });

    res.json({
      success: true,
      data: { project },
    });
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await projectsService.deleteProject(id, req.user.id);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getMyProjects,
  getProject,
  updateProject,
  deleteProject,
};
