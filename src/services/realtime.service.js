const ActivityLog = require('../models/mongodb/ActivityLog');
const RealtimeEvent = require('../models/mongodb/RealtimeEvent');

const logActivity = async ({ workspaceId, userId, action, entityType, entityId, metadata }) => {
  try {
    const log = await ActivityLog.create({
      workspaceId,
      userId,
      action,
      entityType,
      entityId,
      metadata: metadata || {},
    });
    return log;
  } catch (error) {
    console.error('Error logging activity:', error);
    throw error;
  }
};

const saveRealtimeEvent = async ({ workspaceId, userId, eventType, data }) => {
  try {
    const event = await RealtimeEvent.create({
      workspaceId,
      userId,
      eventType,
      data,
    });
    return event;
  } catch (error) {
    console.error('Error saving realtime event:', error);
    throw error;
  }
};

const getWorkspaceActivities = async (workspaceId, { limit = 50 } = {}) => {
  try {
    const activities = await ActivityLog.find({ workspaceId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();
    return activities;
  } catch (error) {
    console.error('Error fetching activities:', error);
    throw error;
  }
};

const getUserActivities = async (userId, { limit = 50 } = {}) => {
  try {
    const activities = await ActivityLog.find({ userId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();
    return activities;
  } catch (error) {
    console.error('Error fetching user activities:', error);
    throw error;
  }
};

module.exports = {
  logActivity,
  saveRealtimeEvent,
  getWorkspaceActivities,
  getUserActivities,
};
