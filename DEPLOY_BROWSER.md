# Deploy to Vercel Using Browser Dashboard

**Complete step-by-step guide for deploying both frontend and backend using only your browser!**

No command line needed! ✨

---

## 📋 Prerequisites

Before starting, you need:
- ✅ GitHub account ([github.com/signup](https://github.com/signup))
- ✅ Vercel account ([vercel.com/signup](https://vercel.com/signup))
- ✅ MongoDB Atlas account ([mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas))
- ✅ Your Bolna API token: `bn-0397e2192bae4bf1917ab197010ddc1c`

**Time Required**: 30-40 minutes

---

## Part 1: Setup MongoDB Atlas (Cloud Database)

### Step 1: Create MongoDB Cluster

1. **Go to** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Click** "Sign In" (or "Start Free" if new account)
3. **Click** "Build a Database"
4. **Select** FREE tier (M0 Sandbox) - $0/month
5. **Provider**: AWS
6. **Region**: Choose closest to you
7. **Cluster Name**: `voice-dashboard`
8. **Click** "Create"

⏳ *Wait 3-5 minutes for cluster to be created*

### Step 2: Create Database User

1. **Click** "Database Access" (left sidebar)
2. **Click** "Add New Database User"
3. **Authentication Method**: Password
4. **Username**: `dashboard-admin`
5. **Password**: Click "Autogenerate Secure Password"
6. **📋 COPY AND SAVE THE PASSWORD** - You'll need this!
7. **Database User Privileges**: "Atlas admin"
8. **Click** "Add User"

### Step 3: Allow Network Access

1. **Click** "Network Access" (left sidebar)
2. **Click** "Add IP Address"
3. **Click** "Allow Access from Anywhere"
   - This adds `0.0.0.0/0` (required for Vercel)
4. **Click** "Confirm"

⏳ *Wait 2 minutes for changes to apply*

### Step 4: Get Connection String

1. **Click** "Database" (left sidebar)
2. **Click** "Connect" button on your cluster
3. **Choose** "Connect your application"
4. **Driver**: Node.js
5. **Version**: 4.1 or later
6. **Copy** the connection string - looks like:
   ```
   mongodb+srv://dashboard-admin:<password>@voice-dashboard.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

7. **Edit the connection string:**
   - Replace `<password>` with the password you saved earlier
   - Add `/voice_dashboard` after `.net`
   
   **Final format:**
   ```
   mongodb+srv://dashboard-admin:YOUR_ACTUAL_PASSWORD@voice-dashboard.xxxxx.mongodb.net/voice_dashboard?retryWrites=true&w=majority
   ```

8. **📋 SAVE THIS** - You'll need it for Vercel!

✅ **MongoDB Atlas is ready!**

---

## Part 2: Push Code to GitHub

### Step 1: Create GitHub Repository

1. **Go to** [github.com/new](https://github.com/new)
2. **Repository name**: `voice-dashboard`
3. **Description**: "Voice AI Dashboard with Bolna Integration"
4. **Visibility**: Private or Public (your choice)
5. **DO NOT** initialize with README, .gitignore, or license
6. **Click** "Create repository"

### Step 2: Create .gitignore File

1. **In your project folder**, create a file named `.gitignore` (if not exists)
2. **Add this content:**

```
# Dependencies
node_modules/
backend/node_modules/

# Environment variables
.env
.env.local
backend/.env
backend/.env.local

# Build outputs
dist/
build/
.next/

# Logs
*.log
npm-debug.log*

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/

# Test files
backend/test-bolna.js
backend/clear-and-resync.js
backend/inspect-api.js
```

### Step 3: Initialize Git (if not already done)

**Option A: Using Git Desktop (Easiest)**
1. Download [GitHub Desktop](https://desktop.github.com/)
2. Install and sign in with GitHub
3. Click "Add" → "Add Existing Repository"
4. Choose your `Voice-DashBoard` folder
5. Click "Publish repository"
6. Select your repository
7. Click "Publish"

**Option B: Using Git Command Line**

Open terminal/PowerShell in your project folder:

```bash
git init
git add .
git commit -m "Initial commit - Voice Dashboard"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/voice-dashboard.git
git push -u origin main
```

✅ **Code is on GitHub!**

---

## Part 3: Deploy Backend to Vercel

### Step 1: Import Backend Project

1. **Go to** [vercel.com/dashboard](https://vercel.com/dashboard)
2. **Click** "Add New..." → "Project"
3. **Select** "Import Git Repository"
4. **Find** your `voice-dashboard` repository
5. **Click** "Import"

### Step 2: Configure Backend

1. **Project Name**: `voice-dashboard-api`
2. **Framework Preset**: Other
3. **Root Directory**: Click "Edit" → Select `backend` folder → Click "Continue"
   
   *This tells Vercel to deploy only the backend folder*

4. **Build Command**: Leave empty
5. **Output Directory**: Leave empty
6. **Install Command**: `npm install`

### Step 3: Add Environment Variables

**Click** "Environment Variables" section, then add these **one by one**:

#### Variable 1: MONGODB_URI
- **Name**: `MONGODB_URI`
- **Value**: Paste your MongoDB connection string from Part 1, Step 4
- **Environments**: Check all 3 boxes (Production, Preview, Development)
- **Click** "Add"

#### Variable 2: JWT_SECRET
- **Name**: `JWT_SECRET`
- **Value**: Make a random 32+ character string, example:
  ```
  my_super_secret_jwt_key_2024_voice_dashboard_secure
  ```
  Or use an online generator: [randomkeygen.com](https://randomkeygen.com/)
- **Environments**: Check all 3 boxes
- **Click** "Add"

#### Variable 3: BOLNA_API_URL
- **Name**: `BOLNA_API_URL`
- **Value**: `https://api.bolna.ai`
- **Environments**: Check all 3 boxes
- **Click** "Add"

#### Variable 4: BOLNA_BEARER_TOKEN
- **Name**: `BOLNA_BEARER_TOKEN`
- **Value**: `bn-0397e2192bae4bf1917ab197010ddc1c`
- **Environments**: Check all 3 boxes
- **Click** "Add"

#### Variable 5: FRONTEND_URL
- **Name**: `FRONTEND_URL`
- **Value**: Leave this empty for now (we'll add it after frontend deployment)
- **Environments**: Check all 3 boxes
- **Click** "Add"

### Step 4: Deploy Backend

1. **Click** "Deploy" button
2. ⏳ **Wait** 2-3 minutes for deployment
3. 🎉 **Success!** You'll see "Congratulations" screen
4. **Click** "Continue to Dashboard"

### Step 5: Get Backend URL

1. **Click** "Visit" button (or copy the URL shown)
2. **Your backend URL** looks like:
   ```
   https://voice-dashboard-api.vercel.app
   ```
   or
   ```
   https://voice-dashboard-api-xxx.vercel.app
   ```

3. **📋 COPY AND SAVE THIS URL** - You'll need it for frontend!

4. **Test it**: Open `https://YOUR-BACKEND-URL.vercel.app/health`
   - Should show: `{"status":"ok","timestamp":"..."}`

✅ **Backend is deployed!**

---

## Part 4: Deploy Frontend to Vercel

### Step 1: Update Frontend Environment

**Before deploying frontend**, update `.env.production`:

1. **Open** `.env.production` in your project root
2. **Replace** with your actual backend URL:
   ```env
   VITE_API_URL=https://YOUR-ACTUAL-BACKEND-URL.vercel.app
   ```
   Example:
   ```env
   VITE_API_URL=https://voice-dashboard-api.vercel.app
   ```

3. **Save** the file
4. **Commit and push** to GitHub:
   - If using GitHub Desktop: Commit message "Update backend URL", then click "Push origin"
   - If using command line:
     ```bash
     git add .env.production
     git commit -m "Update backend URL for production"
     git push
     ```

### Step 2: Import Frontend Project

1. **Go to** [vercel.com/dashboard](https://vercel.com/dashboard)
2. **Click** "Add New..." → "Project"
3. **Find** your `voice-dashboard` repository
4. **Click** "Import"

### Step 3: Configure Frontend

1. **Project Name**: `voice-dashboard`
2. **Framework Preset**: Vite (should auto-detect)
3. **Root Directory**: Leave as is (`.` or `/`)
4. **Build Command**: `npm run build` (should be auto-filled)
5. **Output Directory**: `dist` (should be auto-filled)
6. **Install Command**: `npm install`

### Step 4: Add Environment Variables

**Click** "Environment Variables", then add:

#### Variable: VITE_API_URL
- **Name**: `VITE_API_URL`
- **Value**: Your backend URL from Part 3, Step 5
  ```
  https://voice-dashboard-api.vercel.app
  ```
- **Environments**: Check all 3 boxes
- **Click** "Add"

### Step 5: Deploy Frontend

1. **Click** "Deploy" button
2. ⏳ **Wait** 2-3 minutes for build and deployment
3. 🎉 **Success!**
4. **Click** "Continue to Dashboard"

### Step 6: Get Frontend URL

1. **Click** "Visit" button
2. **Your frontend URL** looks like:
   ```
   https://voice-dashboard.vercel.app
   ```
   or
   ```
   https://voice-dashboard-xxx.vercel.app
   ```

3. **📋 COPY AND SAVE THIS URL**

✅ **Frontend is deployed!**

---

## Part 5: Connect Frontend & Backend (CORS Fix)

### Update Backend Environment Variable

1. **Go to** [vercel.com/dashboard](https://vercel.com/dashboard)
2. **Click** on your **backend project** (`voice-dashboard-api`)
3. **Click** "Settings" tab
4. **Click** "Environment Variables" (left sidebar)
5. **Find** `FRONTEND_URL`
6. **Click** "Edit" (pencil icon)
7. **Update Value** with your actual frontend URL:
   https://voice-dashboard.vercel.app
8. **Click** "Save"

### Redeploy Backend

1. **Click** "Deployments" tab
2. **Click** "..." (three dots) on the latest deployment
3. **Click** "Redeploy"
4. **Click** "Redeploy" again to confirm
5. ⏳ **Wait** 1-2 minutes

✅ **CORS is configured!**

---

## Part 6: Test Your Deployment

### Test Backend

1. **Open** `https://YOUR-BACKEND-URL.vercel.app`
   - Should show API welcome message with version and endpoints

2. **Test health check**: `https://YOUR-BACKEND-URL.vercel.app/health`
   - Should return: `{"status":"ok","timestamp":"..."}`

### Test Frontend

1. **Open** `https://YOUR-FRONTEND-URL.vercel.app`
2. **You should see** the login/register page
3. **Test Registration**:
   - Click "Register"
   - Enter name, email, password
   - Click "Sign Up"
   - Should create account and redirect to dashboard

4. **Test Login**:
   - Enter email and password
   - Click "Sign In"
   - Should redirect to dashboard

5. **Test Dashboard**:
   - Click "Add Agent"
   - Enter Bolna Agent ID (e.g., from your Bolna dashboard)
   - Click "Add Agent"
   - Should appear in agents list

6. **Test Sync**:
   - Click "Sync from Bolna" button
   - Should fetch call data
   - Overview stats should update

🎉 **Everything is working!**

---

## 🎨 Optional: Add Custom Domain

1. **Go to** Frontend Project → Settings → Domains
2. **Click** "Add"
3. **Enter** your domain name (e.g., `dashboard.yourcompany.com`)
4. **Follow** DNS configuration instructions
5. **Wait** for SSL certificate (automatic, ~5 minutes)

Same process for backend if you want!

---

## 📊 Monitor Your Deployment

### Vercel Dashboard Features

**For Each Project (Frontend & Backend):**

1. **Deployments** - History of all deployments
2. **Analytics** - Page views, performance metrics
3. **Logs** - Real-time function logs (very useful for debugging!)
4. **Settings** - Environment variables, domains, etc.

**How to View Logs:**

1. Go to project → Deployments
2. Click on a deployment
3. Click "Functions" tab
4. Click on any function to see logs
5. See real-time errors and console.log outputs

---

## 🐛 Troubleshooting

### Issue: "CORS Error" in browser console

**Fix:**
1. Verify `FRONTEND_URL` in backend environment variables
2. Make sure it matches your actual frontend URL
3. Redeploy backend after changing

### Issue: "Failed to fetch" or "Network Error"

**Fix:**
1. Check `VITE_API_URL` in frontend environment variables
2. Verify backend is deployed and accessible
3. Test backend health endpoint directly

### Issue: "MongoDB connection timeout"

**Fix:**
1. Verify MongoDB Atlas connection string is correct
2. Check password has no special characters (or URL-encode them)
3. Verify Network Access allows 0.0.0.0/0
4. Check Vercel logs for exact error message

### Issue: Environment variables not working

**Fix:**
1. Go to Settings → Environment Variables
2. Make sure all 3 environments are checked (Production, Preview, Development)
3. Redeploy after adding variables

### How to View Error Logs

**Frontend:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for red errors

**Backend:**
1. Vercel Dashboard → Your Backend Project
2. Deployments → Click latest deployment
3. Functions → Click on any function
4. See logs and errors

---

## 🔄 How to Update Your Deployment

### When You Make Code Changes

**Simple Process:**
1. Make changes to your code locally
2. Test locally
3. Commit and push to GitHub
4. Vercel automatically detects and redeploys!

**Using GitHub Desktop:**
1. Make changes in your code
2. GitHub Desktop shows changes
3. Add commit message
4. Click "Commit to main"
5. Click "Push origin"
6. Watch Vercel deploy automatically!

**Vercel will:**
- Detect GitHub push
- Build new version
- Deploy automatically
- Keep old version if build fails
- Send you email notification

---

## 📝 Deployment Summary

### What You Deployed

| Component | URL | Purpose |
|-----------|-----|---------|
| **MongoDB Atlas** | Cloud Database | Stores users, agents, executions |
| **Backend API** | `https://xxx.vercel.app` | Express API + Serverless Functions |
| **Frontend** | `https://yyy.vercel.app` | React Dashboard UI |

### Environment Variables Set

**Backend (5 variables):**
- ✅ `MONGODB_URI` - Database connection
- ✅ `JWT_SECRET` - Auth token secret
- ✅ `BOLNA_API_URL` - Bolna API endpoint
- ✅ `BOLNA_BEARER_TOKEN` - Bolna auth token
- ✅ `FRONTEND_URL` - Your frontend URL (for CORS)

**Frontend (1 variable):**
- ✅ `VITE_API_URL` - Backend API URL

---

## 🎯 Next Steps

Now that you're deployed:

1. **Share your dashboard** - Give URL to team members
2. **Add more agents** - Connect all your Bolna agents
3. **Monitor calls** - Watch real-time call data sync
4. **Custom domain** - Add your own domain name
5. **Scale up** - Upgrade MongoDB/Vercel as needed

---

## 💰 Cost Breakdown

### FREE Tier Limits

**Vercel (Hobby Plan):**
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Serverless function executions
- ✅ Automatic HTTPS
- ⚠️ Upgrade to Pro ($20/month) for team features

**MongoDB Atlas (Free Tier):**
- ✅ 512 MB storage
- ✅ Shared cluster
- ✅ Perfect for development/small production
- ⚠️ Upgrade to M10 ($57/month) for dedicated cluster

**Total Cost**: **$0/month** to start! 🎉

---

## ✅ Deployment Checklist

Use this to verify everything is set up:

**MongoDB Atlas:**
- [ ] Cluster created
- [ ] Database user created with password saved
- [ ] Network access allows 0.0.0.0/0
- [ ] Connection string copied and tested

**GitHub:**
- [ ] Repository created
- [ ] Code pushed to GitHub
- [ ] .gitignore file excludes .env files

**Backend Deployment:**
- [ ] Backend project imported to Vercel
- [ ] Root directory set to `/backend`
- [ ] All 5 environment variables added
- [ ] Deployment successful
- [ ] Backend URL saved
- [ ] Health endpoint tested

**Frontend Deployment:**
- [ ] .env.production updated with backend URL
- [ ] Changes pushed to GitHub
- [ ] Frontend project imported to Vercel
- [ ] VITE_API_URL environment variable added
- [ ] Deployment successful
- [ ] Frontend URL saved

**Connection:**
- [ ] FRONTEND_URL updated in backend
- [ ] Backend redeployed
- [ ] CORS working (no errors in browser console)

**Testing:**
- [ ] Can register new account
- [ ] Can login
- [ ] Can add agent
- [ ] Can sync data from Bolna
- [ ] Dashboard shows stats

---

## 🆘 Need Help?

**Vercel Support:**
- Documentation: [vercel.com/docs](https://vercel.com/docs)
- Community: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

**MongoDB Atlas Support:**
- Documentation: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- Community: [mongodb.com/community/forums](https://www.mongodb.com/community/forums)

---

**Congratulations! Your Voice Dashboard is live! 🎉**

Share your deployment URL and start tracking your Bolna voice agents!
