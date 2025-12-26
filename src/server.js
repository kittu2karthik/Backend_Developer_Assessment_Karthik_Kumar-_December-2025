const http = require('http');
const app = require('./app');
const { connectDB } = require('./config/database');
const connectMongoDB = require('./config/mongodb');
const { initializeWebSocket } = require('./websocket/server');
require('./config/redis'); // Initialize Redis connection
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Connect to databases
    await connectDB(); // PostgreSQL
    await connectMongoDB(); // MongoDB
    // Redis auto-connects on import

    const server = http.createServer(app);

    // Initialize WebSocket
    initializeWebSocket(server);

    server.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received, shutting down gracefully');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
