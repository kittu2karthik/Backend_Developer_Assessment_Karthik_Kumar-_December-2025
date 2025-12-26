const realtimeService = require('../services/realtime.service');

const getWorkspaceActivities = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const { limit = 50 } = req.query;

    const activities = await realtimeService.getWorkspaceActivities(workspaceId, {
      limit: parseInt(limit),
    });

    res.json({
      success: true,
      data: { activities },
    });
  } catch (error) {
    next(error);
  }
};

const getUserActivities = async (req, res, next) => {
  try {
    const { limit = 50 } = req.query;

    const activities = await realtimeService.getUserActivities(req.user.id, {
      limit: parseInt(limit),
    });

    res.json({
      success: true,
      data: { activities },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWorkspaceActivities,
  getUserActivities,
};
