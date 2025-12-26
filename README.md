# Real-Time Collaborative Workspace Backend

**Production-ready backend API for real-time collaborative workspaces with WebSocket support, async job processing, and role-based access control.**

[![CI/CD](https://github.com/kittu2karthik/Backend_Developer_Assessment_Karthik_Kumar-_December-2025/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/kittu2karthik/Backend_Developer_Assessment_Karthik_Kumar-_December-2025/actions)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 🚀 Features

### Core Functionality

- ✅ **JWT & OAuth2 Authentication** - Secure user authentication with refresh tokens
- ✅ **Role-Based Access Control (RBAC)** - Three-tier permissions (Owner, Collaborator, Viewer)
- ✅ **Projects & Workspaces Management** - Full CRUD operations with authorization
- ✅ **Real-Time Collaboration** - WebSocket-based activity broadcasting
- ✅ **Asynchronous Job Processing** - Background workers for code execution, emails, reports
- ✅ **Dual Database Architecture** - PostgreSQL for relational data, MongoDB for logs/events
- ✅ **Redis Caching & Pub/Sub** - Performance optimization and multi-instance scaling
- ✅ **Input Validation** - Request validation with express-validator
- ✅ **Rate Limiting** - Protection against abuse
- ✅ **Comprehensive Error Handling** - Standardized error responses

### DevOps & Quality

- ✅ **Docker Support** - Containerized deployment
- ✅ **docker-compose** - Local development environment
- ✅ **CI/CD Pipeline** - GitHub Actions (lint, test, build)
- ✅ **Health Checks** - Monitoring endpoints
- ✅ **Graceful Shutdown** - Proper cleanup on termination

## 🛠️ Tech Stack

| Category           | Technologies                               |
| ------------------ | ------------------------------------------ |
| **Runtime**        | Node.js v18+                               |
| **Framework**      | Express.js                                 |
| **Language**       | JavaScript (ES6+)                          |
| **Databases**      | PostgreSQL (Sequelize), MongoDB (Mongoose) |
| **Cache/Queue**    | Redis (ioredis), BullMQ                    |
| **Real-Time**      | Socket.io                                  |
| **Authentication** | JWT, bcrypt, Passport.js                   |
| **Validation**     | express-validator                          |
| **Testing**        | Jest, Supertest                            |
| **DevOps**         | Docker, GitHub Actions                     |

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL 15+
- MongoDB 6+
- Redis 7+

## 🏃 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/kittu2karthik/Backend_Developer_Assessment_Karthik_Kumar-_December-2025.git
cd Backend_Developer_Assessment_Karthik_Kumar-_December-2025
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 4. Run with Docker (Recommended)

```bash
docker-compose up
```

### 5. Run Locally

```bash
# Start development server
npm run dev

# Or production mode
npm start
```

## 🔧 Environment Variables

```env
# Server
NODE_ENV=development
PORT=3000
WS_PORT=3001

# Databases (Use free tier services for deployment)
DATABASE_URL=postgresql://user:pass@host:5432/workspace_db
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/workspace_db
REDIS_URL=rediss://default:password@host:port

# JWT Secrets
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-also-32-chars
JWT_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Security
CORS_ORIGIN=*
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user (protected)

### Projects

- `POST /api/projects` - Create project
- `GET /api/projects` - List user's projects (paginated)
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Workspaces

- `POST /api/workspaces` - Create workspace
- `GET /api/workspaces/project/:projectId` - List workspaces by project
- `GET /api/workspaces/:id` - Get workspace details
- `PUT /api/workspaces/:id` - Update workspace
- `DELETE /api/workspaces/:id` - Delete workspace

### Collaborators

- `POST /api/collaborators/workspace/:workspaceId` - Add collaborator
- `GET /api/collaborators/workspace/:workspaceId` - List collaborators
- `PUT /api/collaborators/workspace/:workspaceId/:collaboratorId` - Update role
- `DELETE /api/collaborators/workspace/:workspaceId/:collaboratorId` - Remove collaborator

### Activities

- `GET /api/activities/workspace/:workspaceId` - Get workspace activity logs
- `GET /api/activities/me` - Get user's activities

### Jobs (Async Processing)

- `POST /api/jobs/execute-code` - Queue code execution
- `POST /api/jobs/send-email` - Queue email sending
- `POST /api/jobs/generate-report` - Queue report generation
- `GET /api/jobs/:queueName/:jobId` - Get job status

### WebSocket Events

- `workspace:join` - Join a workspace room
- `workspace:leave` - Leave a workspace room
- `user:activity` - Broadcast user activity
- `cursor:move` - Share cursor position
- `typing:start/stop` - Typing indicators
- `content:change` - Content synchronization

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## � Docker Deployment

### Build Image

```bash
docker build -t workspace-backend .
```

### Run Container

```bash
docker run -p 3000:3000 -p 3001:3001 \
  -e DATABASE_URL=your_db_url \
  -e MONGODB_URI=your_mongo_uri \
  -e REDIS_URL=your_redis_url \
  workspace-backend
```

### Docker Compose (Local Development)

```bash
docker-compose up -d
```

## 🌐 Deployment

### Render.com (Free Tier)

1. Connect GitHub repository
2. Create Web Service
3. Add environment variables
4. Deploy automatically

**External Services (Free Tiers):**

- **PostgreSQL:** Neon.tech (10GB)
- **MongoDB:** MongoDB Atlas (512MB)
- **Redis:** Upstash (10k commands/day)

See [deployment guide](docs/DEPLOYMENT.md) for detailed instructions.

## 📚 Documentation

- [API Documentation](docs/API.md) - Detailed API reference
- [Architecture](docs/ARCHITECTURE.md) - System design
- [Deployment Guide](docs/DEPLOYMENT.md) - Deployment instructions
- [Postman Collection](postman/workspace-api.postman_collection.json) - API testing

## 🏗️ Project Structure

```
├── src/
│   ├── config/           # Database and Redis connections
│   ├── models/           # Sequelize & Mongoose models
│   │   ├── postgres/     # PostgreSQL models
│   │   └── mongodb/      # MongoDB schemas
│   ├── middleware/       # Auth, RBAC, validation, error handling
│   ├── routes/           # API route definitions
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic
│   ├── websocket/        # Socket.io server & handlers
│   ├── workers/          # BullMQ background workers
│   ├── utils/            # Helper functions
│   ├── app.js            # Express app setup
│   └── server.js         # Server entry point
├── tests/                # Jest tests
│   ├── unit/             # Unit tests
│   └── integration/      # Integration tests
├── docker/               # Docker-related files
├── .github/workflows/    # GitHub Actions CI/CD
└── docs/                 # Documentation
```
