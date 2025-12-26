const collaboratorsService = require('../services/collaborators.service');

const addCollaborator = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const { userEmail, role } = req.body;

    const collaborator = await collaboratorsService.addCollaborator({
      workspaceId,
      userEmail,
      role,
      requestUserId: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: { collaborator },
    });
  } catch (error) {
    next(error);
  }
};

const getCollaborators = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;

    const collaborators = await collaboratorsService.getWorkspaceCollaborators(
      workspaceId,
      req.user.id
    );

    res.json({
      success: true,
      data: { collaborators },
    });
  } catch (error) {
    next(error);
  }
};

const updateRole = async (req, res, next) => {
  try {
    const { workspaceId, collaboratorId } = req.params;
    const { role } = req.body;

    const collaborator = await collaboratorsService.updateCollaboratorRole({
      workspaceId,
      collaboratorId,
      newRole: role,
      requestUserId: req.user.id,
    });

    res.json({
      success: true,
      data: { collaborator },
    });
  } catch (error) {
    next(error);
  }
};

const removeCollaborator = async (req, res, next) => {
  try {
    const { workspaceId, collaboratorId } = req.params;

    const result = await collaboratorsService.removeCollaborator({
      workspaceId,
      collaboratorId,
      requestUserId: req.user.id,
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addCollaborator,
  getCollaborators,
  updateRole,
  removeCollaborator,
};
