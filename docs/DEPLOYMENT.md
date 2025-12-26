# 🚀 Render.com Deployment Guide

## Step-by-Step Deployment Process

### Phase 1: Set Up External Database Services (15 minutes)

#### 1️⃣ **PostgreSQL - Neon.tech (FREE FOREVER)**

1. Go to **https://neon.tech**
2. Click **Sign Up** → Use GitHub account
3. Click **Create Project**
   - Name: `workspace-backend`
   - Region: Choose closest to you
   - Postgres Version: 15
4. Click **Create Project**
5. **COPY** the connection string:
   ```
   postgresql://username:password@host.neon.tech/dbname?sslmode=require
   ```
6. Save this for later ✅

---

#### 2️⃣ **MongoDB - MongoDB Atlas (FREE FOREVER)**

1. Go to **https://www.mongodb.com/cloud/atlas**
2. Click **Try Free** → Sign up with Google
3. Choose **M0 (Free)** cluster
   - Cloud Provider: AWS
   - Region: Choose closest
   - Cluster Name: `workspace-db`
4. Click **Create Cluster** (takes 2-3 minutes)
5. **Security:**
   - Click **Database Access** → Add User
   - Username: `admin`, Password: (generate)
   - Database User Privileges: `Read and write to any database`
   - Save password! ✅
6. **Network Access:**
   - Click **Network Access** → Add IP Address
   - Select **Allow access from anywhere** (0.0.0.0/0)
   - Click **Confirm**
7. **Get Connection String:**
   - Click **Database** → **Connect** → **Connect your application**
   - Copy connection string:
     ```
     mongodb+srv://admin:<password>@workspace-db.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your saved password
8. Save this for later ✅

---

#### 3️⃣ **Redis - Upstash (FREE FOREVER)**

1. Go to **https://upstash.com**
2. Click **Get Started** → Sign up with GitHub
3. Click **Create Database**
   - Name: `workspace-redis`
   - Type: **Regional**
   - Region: Choose closest
   - TLS: **Enabled**
4. Click **Create**
5. **Get Connection String:**
   - Click on your database
   - Scroll to **REST API** section
   - Copy **UPSTASH_REDIS_REST_URL**:
     ```
     rediss://default:xxxxx@us1-xxxxx.upstash.io:6379
     ```
6. Save this for later ✅

---

### Phase 2: Deploy to Render.com (10 minutes)

#### 1️⃣ **Create Render Account**

1. Go to **https://render.com**
2. Click **Get Started** → Sign up with GitHub
3. Authorize Render to access your repositories

---

#### 2️⃣ **Deploy Web Service**

1. Click **New +** → **Web Service**
2. **Connect Repository:**
   - Find: `Backend_Developer_Assessment_Karthik_Kumar-_December-2025`
   - Click **Connect**
3. **Configure Service:**
   - **Name:** `workspace-backend`
   - **Region:** Oregon (US West)
   - **Branch:** `master`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free
4. **Environment Variables** - Click **Advanced** → **Add Environment Variable**

   Add these one by one:

   | Key                       | Value                                            |
   | ------------------------- | ------------------------------------------------ |
   | `NODE_ENV`                | `production`                                     |
   | `PORT`                    | `3000`                                           |
   | `WS_PORT`                 | `3001`                                           |
   | `DATABASE_URL`            | Paste your **Neon PostgreSQL** connection string |
   | `MONGODB_URI`             | Paste your **MongoDB Atlas** connection string   |
   | `REDIS_URL`               | Paste your **Upstash Redis** connection string   |
   | `JWT_SECRET`              | `your-random-secret-min-32-characters-long`      |
   | `JWT_REFRESH_SECRET`      | `your-refresh-secret-also-32-chars-long`         |
   | `JWT_EXPIRY`              | `15m`                                            |
   | `JWT_REFRESH_EXPIRY`      | `7d`                                             |
   | `CORS_ORIGIN`             | `*`                                              |
   | `RATE_LIMIT_WINDOW_MS`    | `900000`                                         |
   | `RATE_LIMIT_MAX_REQUESTS` | `100`                                            |

5. Click **Create Web Service**

---

#### 3️⃣ **Wait for Deployment**

- Render will automatically:
  - Clone your repo
  - Install dependencies
  - Start your server
- Takes about 5-10 minutes
- Watch the logs for any errors

---

#### 4️⃣ **Get Your Live URL**

Once deployed, you'll get a URL like:

```
https://workspace-backend.onrender.com
```

---

### Phase 3: Test Your Deployment (5 minutes)

#### 1️⃣ **Health Check**

```bash
curl https://workspace-backend.onrender.com/health
```

Expected response:

```json
{
  "status": "OK",
  "timestamp": "2025-12-26T...",
  "uptime": 123.456,
  "environment": "production"
}
```

---

#### 2️⃣ **Register User**

```bash
curl -X POST https://workspace-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User"
  }'
```

---

#### 3️⃣ **Login**

```bash
curl -X POST https://workspace-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

### 🎯 Important Notes

#### **Free Tier Limitations:**

1. **Render.com:**
   - Spins down after 15 minutes of inactivity
   - Takes ~30 seconds to wake up on first request
   - 750 hours/month (enough for the assignment)

2. **Databases:**
   - Neon: 10GB storage, always-on
   - MongoDB Atlas: 512MB, always-on
   - Upstash: 10,000 commands/day, always-on

#### **Wake Up Your App:**

Before demo/testing, visit your URL to wake it up:

```
https://workspace-backend.onrender.com/health
```

---

### 🐛 Troubleshooting

#### **Deployment Failed?**

1. Check Render logs for errors
2. Verify all environment variables are set
3. Ensure database connection strings are correct

#### **Database Connection Errors?**

1. **PostgreSQL:** Check Neon connection string has `?sslmode=require`
2. **MongoDB:** Verify IP whitelist includes `0.0.0.0/0`
3. **Redis:** Ensure URL starts with `rediss://` (note the extra 's')

#### **App Not Starting?**

1. Check `package.json` has correct start script
2. Verify Node.js version compatibility
3. Review build logs in Render dashboard

---

### ✅ Deployment Checklist

- [ ] Created Neon PostgreSQL database
- [ ] Created MongoDB Atlas cluster
- [ ] Created Upstash Redis database
- [ ] Connected GitHub repo to Render
- [ ] Added all environment variables
- [ ] Deployment successful (green status)
- [ ] Health check works
- [ ] Can register user
- [ ] Can login user
- [ ] Tested at least 3 API endpoints

---

### 🎉 You're Done!

Your backend is now live at:

```
https://workspace-backend.onrender.com
```

Add this URL to your assignment submission! 🚀
