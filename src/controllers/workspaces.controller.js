const workspacesService = require('../services/workspaces.service');

const createWorkspace = async (req, res, next) => {
  try {
    const { projectId, name, description, settings } = req.body;

    const workspace = await workspacesService.createWorkspace({
      projectId,
      name,
      description,
      settings,
      userId: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: { workspace },
    });
  } catch (error) {
    next(error);
  }
};

const getWorkspacesByProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const workspaces = await workspacesService.getWorkspacesByProject(projectId, req.user.id);

    res.json({
      success: true,
      data: { workspaces },
    });
  } catch (error) {
    next(error);
  }
};

const getWorkspace = async (req, res, next) => {
  try {
    const { id } = req.params;

    const workspace = await workspacesService.getWorkspaceById(id);

    res.json({
      success: true,
      data: { workspace },
    });
  } catch (error) {
    next(error);
  }
};

const updateWorkspace = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, settings } = req.body;

    const workspace = await workspacesService.updateWorkspace(id, req.user.id, {
      name,
      description,
      settings,
    });

    res.json({
      success: true,
      data: { workspace },
    });
  } catch (error) {
    next(error);
  }
};

const deleteWorkspace = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await workspacesService.deleteWorkspace(id, req.user.id);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createWorkspace,
  getWorkspacesByProject,
  getWorkspace,
  updateWorkspace,
  deleteWorkspace,
};
