const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      enum: ['created', 'updated', 'deleted', 'joined', 'left', 'invited'],
    },
    entityType: {
      type: String,
      required: true,
      enum: ['project', 'workspace', 'file', 'user', 'collaborator'],
    },
    entityId: {
      type: String,
      required: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    collection: 'activity_logs',
  }
);

// Compound index for efficient queries
activityLogSchema.index({ workspaceId: 1, timestamp: -1 });
activityLogSchema.index({ userId: 1, timestamp: -1 });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

module.exports = ActivityLog;
