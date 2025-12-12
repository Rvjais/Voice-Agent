# Vercel Deployment Guide - Voice Dashboard

Complete guide to deploy both frontend (React) and backend (Express API) to Vercel.

## 🎯 Overview

- **Frontend**: Vite React App → Vercel Static Hosting
- **Backend**: Express API → Vercel Serverless Functions
- **Database**: MongoDB Atlas (cloud database)

## 📋 Prerequisites

1. ✅ Vercel account ([vercel.com/signup](https://vercel.com/signup))
2. ✅ MongoDB Atlas account ([mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas))
3. ✅ GitHub account (recommended for auto-deployments)
4. ✅ Your Bolna API Bearer Token

---

## Part 1: Setup MongoDB Atlas

### Step 1: Create MongoDB Atlas Cluster

1. **Go to** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Click** "Build a Database"
3. **Select** FREE tier (M0 Sandbox)
4. **Choose** a cloud provider and region (AWS recommended)
5. **Cluster Name**: `voice-dashboard`
6. **Click** "Create"

### Step 2: Create Database User

1. **Go to** Database Access → Add New Database User
2. **Username**: `dashboard-admin`
3. **Password**: Generate a secure password (save it!)
4. **Database User Privileges**: Atlas admin
5. **Click** "Add User"

### Step 3: Whitelist IP Addresses

1. **Go to** Network Access → Add IP Address
2. **Click** "Allow Access from Anywhere" (0.0.0.0/0)
   - This is required for Vercel serverless functions
3. **Click** "Confirm"

### Step 4: Get Connection String

1. **Go to** Database → Connect
2. **Select** "Connect your application"
3. **Driver**: Node.js, Version: 4.1 or later
4. **Copy** the connection string:
   ```
   mongodb+srv://dashboard-admin:<password>@voice-dashboard.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **Replace** `<password>` with your database user password
6. **Add** database name:
   ```
   mongodb+srv://dashboard-admin:YOUR_PASSWORD@voice-dashboard.xxxxx.mongodb.net/voice_dashboard?retryWrites=true&w=majority
   ```

---

## Part 2: Prepare Backend for Vercel

### Step 1: Create `vercel.json` in backend folder

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Step 2: Update `server.js` for Vercel

Add this at the BOTTOM of `server.js`:

```javascript
// Export for Vercel serverless
module.exports = app;
```

### Step 3: Create `.vercelignore` in backend folder

```
node_modules
.env
*.log
.DS_Store
```

### Step 4: Update CORS Configuration

In `server.js`, update CORS to allow your frontend domain:

```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://your-frontend-app.vercel.app',  // Will update this after frontend deployment
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

---

## Part 3: Deploy Backend to Vercel

### Method A: Using Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

3. **Login to Vercel:**
   ```bash
   vercel login
   ```

4. **Deploy:**
   ```bash
   vercel
   ```
   
   Follow prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - What's your project's name? `voice-dashboard-api`
   - In which directory is your code located? `./`
   - Want to override settings? **N**

5. **Add Environment Variables:**
   ```bash
   vercel env add MONGODB_URI
   # Paste your MongoDB Atlas connection string
   
   vercel env add JWT_SECRET
   # Paste a strong random secret
   
   vercel env add BOLNA_API_URL
   # Paste: https://api.bolna.ai
   
   vercel env add BOLNA_BEARER_TOKEN
   # Paste: bn-0397e2192bae4bf1917ab197010ddc1c
   
   vercel env add FRONTEND_URL
   # Leave empty for now, will update later
   ```

6. **Deploy to Production:**
   ```bash
   vercel --prod
   ```

7. **Note your backend URL:**
   ```
   https://voice-dashboard-api.vercel.app
   ```

### Method B: Using Vercel Dashboard

1. **Go to** [vercel.com/dashboard](https://vercel.com/dashboard)
2. **Click** "Add New" → "Project"
3. **Import** your backend repository
4. **Configure:**
   - Framework Preset: **Other**
   - Root Directory: `backend` (if in monorepo) or `./`
   - Build Command: Leave empty
   - Output Directory: Leave empty
5. **Add Environment Variables** (same as above)
6. **Click** "Deploy"

---

## Part 4: Prepare Frontend for Vercel

### Step 1: Create `.env.production` in frontend root

```env
VITE_API_URL=https://voice-dashboard-api.vercel.app
```

### Step 2: Update `src/services/api.js`

Ensure it uses environment variable:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Step 3: Create `vercel.json` in frontend root

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## Part 5: Deploy Frontend to Vercel

### Method A: Using Vercel CLI

1. **Navigate to frontend (root) folder:**
   ```bash
   cd ..  # Go back to project root
   ```

2. **Deploy:**
   ```bash
   vercel
   ```
   
   Follow prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - What's your project's name? `voice-dashboard`
   - In which directory is your code located? `./`
   - Want to override settings? **N**

3. **Add Environment Variables:**
   ```bash
   vercel env add VITE_API_URL
   # Paste: https://voice-dashboard-api.vercel.app
   ```

4. **Deploy to Production:**
   ```bash
   vercel --prod
   ```

5. **Note your frontend URL:**
   ```
   https://voice-dashboard.vercel.app
   ```

### Method B: Using Vercel Dashboard

1. **Go to** [vercel.com/dashboard](https://vercel.com/dashboard)
2. **Click** "Add New" → "Project"
3. **Import** your frontend repository
4. **Configure:**
   - Framework Preset: **Vite**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. **Add Environment Variables:**
   - `VITE_API_URL` = `https://voice-dashboard-api.vercel.app`
6. **Click** "Deploy"

---

## Part 6: Final Configuration

### Update Backend CORS

1. **Go to** Vercel Dashboard → Backend Project → Settings → Environment Variables
2. **Update** `FRONTEND_URL`:
   ```
   https://voice-dashboard.vercel.app
   ```
3. **Redeploy** backend:
   ```bash
   cd backend
   vercel --prod
   ```

### Update Backend `server.js` CORS

Replace the frontend URL in allowed origins:

```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'https://voice-dashboard.vercel.app',  // Your actual frontend URL
];
```

---

## 🧪 Testing Deployment

### Test Backend API

```bash
# Test health check
curl https://voice-dashboard-api.vercel.app/api/health

# Test registration
curl -X POST https://voice-dashboard-api.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

### Test Frontend

1. Open `https://voice-dashboard.vercel.app`
2. Register a new account
3. Login
4. Add an agent
5. Sync data from Bolna

---

## 📁 Project Structure for Vercel

### Option 1: Monorepo (Single Repository)

```
voice-dashboard/
├── frontend files (root)
├── backend/
│   ├── vercel.json
│   ├── server.js
│   └── ...
├── vercel.json (for frontend)
└── package.json
```

Deploy:
- Frontend from root
- Backend from `/backend` subdirectory

### Option 2: Separate Repositories

```
voice-dashboard-frontend/  (separate repo)
└── all frontend files

voice-dashboard-backend/  (separate repo)
└── all backend files
```

Deploy each separately on Vercel.

---

## 🔒 Security Checklist

Before going live:

- [ ] Change all default passwords
- [ ] Use strong `JWT_SECRET` (32+ random characters)
- [ ] Verify MongoDB Atlas IP whitelist
- [ ] Test CORS configuration
- [ ] Check environment variables are set correctly
- [ ] Test authentication flow end-to-end
- [ ] Verify Bolna API token is working

---

## 🐛 Common Issues & Solutions

### Issue: API calls failing with CORS error

**Solution**: 
1. Check `FRONTEND_URL` environment variable in backend
2. Verify allowed origins in `server.js`
3. Redeploy backend after changes

### Issue: MongoDB connection timeout

**Solution**:
1. Verify MongoDB Atlas connection string
2. Check Network Access allows 0.0.0.0/0
3. Ensure password doesn't have special characters (URL encode if needed)

### Issue: Environment variables not working

**Solution**:
1. Add variables in Vercel Dashboard
2. **Select all environments** (Production, Preview, Development)
3. Redeploy after adding variables

### Issue: 500 error on backend

**Solution**:
1. Check Vercel Function Logs
2. Verify all environment variables are set
3. Test MongoDB connection locally first

---

## 🚀 Continuous Deployment

### Setup Auto-Deploy from GitHub

1. **Connect GitHub** to Vercel project
2. **Enable** automatic deployments
3. **Every git push** to main branch triggers deployment
4. **Preview deployments** for pull requests

### Branch Strategy

- `main` → Production deployment
- `develop` → Preview deployment
- Feature branches → Preview deployments

---

## 📊 Monitoring

### Vercel Dashboard

- **Analytics**: Track page views, performance
- **Logs**: View serverless function logs
- **Deployment History**: Rollback if needed

### MongoDB Atlas

- **Metrics**: Monitor database performance
- **Alerts**: Set up alerts for issues

---

## 💰 Pricing

### Vercel (Hobby Plan - FREE)

- Unlimited deployments
- 100 GB bandwidth/month
- Serverless function execution

### MongoDB Atlas (Free Tier)

- 512 MB storage
- Shared CPU
- Perfect for starting out

**Upgrade when needed** for production scale.

---

## 📝 Environment Variables Summary

### Backend (.env)

```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_super_secret_key_here
BOLNA_API_URL=https://api.bolna.ai
BOLNA_BEARER_TOKEN=bn-0397e2192bae4bf1917ab197010ddc1c
FRONTEND_URL=https://voice-dashboard.vercel.app
NODE_ENV=production
```

### Frontend (.env.production)

```env
VITE_API_URL=https://voice-dashboard-api.vercel.app
```

---

## ✅ Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with password saved
- [ ] IP whitelist configured (0.0.0.0/0)
- [ ] Connection string obtained
- [ ] Backend `vercel.json` created
- [ ] Backend deployed to Vercel
- [ ] Backend environment variables set
- [ ] Backend URL noted
- [ ] Frontend `.env.production` created
- [ ] Frontend `vercel.json` created
- [ ] Frontend deployed to Vercel
- [ ] Frontend environment variables set
- [ ] Frontend URL noted
- [ ] Backend CORS updated with frontend URL
- [ ] Backend redeployed
- [ ] Tested registration & login
- [ ] Tested adding agent
- [ ] Tested syncing data

---

**Need Help?** 
- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- MongoDB Atlas Docs: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
