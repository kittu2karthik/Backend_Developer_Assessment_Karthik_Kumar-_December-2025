const { Server } = require('socket.io');
const { verifyToken } = require('../services/jwt.service');
const redis = require('../config/redis');

let io = null;

const initializeWebSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    path: '/socket.io',
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization;

      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      // Remove 'Bearer ' prefix if present
      const cleanToken = token.startsWith('Bearer ') ? token.substring(7) : token;

      const decoded = verifyToken(cleanToken);
      socket.userId = decoded.userId;
      socket.userEmail = decoded.email;

      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  // Connection handler
  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.userId} (${socket.id})`);

    // Join workspace room
    socket.on('workspace:join', async ({ workspaceId }) => {
      try {
        await socket.join(`workspace:${workspaceId}`);
        console.log(`User ${socket.userId} joined workspace ${workspaceId}`);

        // Notify others in the workspace
        socket.to(`workspace:${workspaceId}`).emit('user:joined', {
          userId: socket.userId,
          userEmail: socket.userEmail,
          timestamp: new Date(),
        });

        // Send current users in workspace
        const sockets = await io.in(`workspace:${workspaceId}`).fetchSockets();
        socket.emit('workspace:users', {
          users: sockets.map((s) => ({
            userId: s.userId,
            userEmail: s.userEmail,
          })),
        });
      } catch (error) {
        socket.emit('error', { message: 'Failed to join workspace' });
      }
    });

    // Leave workspace room
    socket.on('workspace:leave', ({ workspaceId }) => {
      socket.leave(`workspace:${workspaceId}`);
      console.log(`User ${socket.userId} left workspace ${workspaceId}`);

      // Notify others
      socket.to(`workspace:${workspaceId}`).emit('user:left', {
        userId: socket.userId,
        userEmail: socket.userEmail,
        timestamp: new Date(),
      });
    });

    // User activity events
    socket.on('user:activity', ({ workspaceId, activity }) => {
      // Broadcast to others in workspace
      socket.to(`workspace:${workspaceId}`).emit('user:activity', {
        userId: socket.userId,
        userEmail: socket.userEmail,
        activity,
        timestamp: new Date(),
      });

      // Publish to Redis for multi-server sync
      const message = JSON.stringify({
        type: 'user:activity',
        workspaceId,
        userId: socket.userId,
        userEmail: socket.userEmail,
        activity,
        timestamp: new Date(),
      });
      redis.publish('workspace:events', message);
    });

    // Cursor position updates
    socket.on('cursor:move', ({ workspaceId, position }) => {
      socket.to(`workspace:${workspaceId}`).emit('cursor:move', {
        userId: socket.userId,
        position,
      });
    });

    // Typing indicators
    socket.on('typing:start', ({ workspaceId }) => {
      socket.to(`workspace:${workspaceId}`).emit('typing:start', {
        userId: socket.userId,
        userEmail: socket.userEmail,
      });
    });

    socket.on('typing:stop', ({ workspaceId }) => {
      socket.to(`workspace:${workspaceId}`).emit('typing:stop', {
        userId: socket.userId,
      });
    });

    // Content changes
    socket.on('content:change', ({ workspaceId, changes }) => {
      socket.to(`workspace:${workspaceId}`).emit('content:change', {
        userId: socket.userId,
        changes,
        timestamp: new Date(),
      });

      // Publish to Redis
      const message = JSON.stringify({
        type: 'content:change',
        workspaceId,
        userId: socket.userId,
        changes,
        timestamp: new Date(),
      });
      redis.publish('workspace:events', message);
    });

    // Disconnect handler
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.userId} (${socket.id})`);
    });

    // Error handler
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  // Subscribe to Redis for multi-server events
  const subscriber = redis.duplicate();
  subscriber.subscribe('workspace:events', (err) => {
    if (err) {
      console.error('Failed to subscribe to Redis channel:', err);
    } else {
      console.log('✅ Subscribed to workspace:events channel');
    }
  });

  subscriber.on('message', (channel, message) => {
    try {
      const event = JSON.parse(message);
      const { type, workspaceId, ...data } = event;

      // Broadcast to all clients in the workspace
      io.to(`workspace:${workspaceId}`).emit(type, data);
    } catch (error) {
      console.error('Error processing Redis message:', error);
    }
  });

  console.log('✅ WebSocket server initialized');
  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('WebSocket server not initialized');
  }
  return io;
};

module.exports = { initializeWebSocket, getIO };
