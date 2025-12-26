# Workspace Backend API

Real-time collaborative workspace backend with WebSocket support, async job processing, and role-based access control.

## 🚀 Features

- JWT & OAuth2 Authentication
- Role-Based Access Control (Owner, Collaborator, Viewer)
- Real-time WebSocket Communication
- Asynchronous Job Processing
- PostgreSQL + MongoDB Dual Database
- Redis Caching & Pub/Sub

## 🛠️ Tech Stack

- **Runtime:** Node.js v18+
- **Framework:** Express.js
- **Databases:** PostgreSQL (Neon), MongoDB (Atlas)
- **Cache/Queue:** Redis (Upstash)
- **Real-time:** Socket.io
- **Jobs:** BullMQ
- **Testing:** Jest + Supertest

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

## 🏃 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Run locally
npm run dev

# Run tests
npm test

# Run with Docker
docker-compose up
```

## 🌐 Live Deployment

**URL:** https://workspace-backend.onrender.com

## 📚 Documentation

- API Documentation: [docs/API.md](docs/API.md)
- Architecture: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage
```

## 📦 Deployment

Deployed on Render.com with:

- Neon PostgreSQL (10GB)
- MongoDB Atlas (512MB)
- Upstash Redis (10k commands/day)

## 👤 Author

[Your Name]

## 📄 License

MIT
