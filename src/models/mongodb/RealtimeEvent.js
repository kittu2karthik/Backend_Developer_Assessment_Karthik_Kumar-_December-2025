const mongoose = require('mongoose');

const realtimeEventSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
    },
    eventType: {
      type: String,
      required: true,
      enum: ['cursor_move', 'typing', 'selection', 'user_joined', 'user_left', 'content_change'],
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      expires: 3600, // TTL index - documents expire after 1 hour
    },
  },
  {
    collection: 'realtime_events',
  }
);

// Index for efficient real-time queries
realtimeEventSchema.index({ workspaceId: 1, timestamp: -1 });

const RealtimeEvent = mongoose.model('RealtimeEvent', realtimeEventSchema);

module.exports = RealtimeEvent;
