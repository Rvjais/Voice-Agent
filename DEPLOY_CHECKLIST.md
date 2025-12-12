# Quick Deployment Checklist - Browser Method

Follow this checklist in order. Each step links to the detailed guide.

## ☑️ Step 1: MongoDB Atlas (10 min)

- [ ] Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- [ ] Create FREE M0 cluster
- [ ] Create database user + save password
- [ ] Add IP address: 0.0.0.0/0
- [ ] Copy connection string
- [ ] Replace `<password>` with actual password
- [ ] Add `/voice_dashboard` after `.net`
- [ ] **Save final connection string** 📋

## ☑️ Step 2: Push to GitHub (5 min)

- [ ] Create repository at [github.com/new](https://github.com/new)
- [ ] Name it: `voice-dashboard`
- [ ] Download [GitHub Desktop](https://desktop.github.com/) (easiest)
- [ ] Add existing repository (your project folder)
- [ ] Publish repository to GitHub

## ☑️ Step 3: Deploy Backend (10 min)

- [ ] Go to [vercel.com/dashboard](https://vercel.com/dashboard)
- [ ] Click "Add New" → "Project"
- [ ] Import your GitHub repository
- [ ] Project name: `voice-dashboard-api`
- [ ] Root directory: Select `backend` folder
- [ ] Add environment variables:
  - [ ] `MONGODB_URI` = Your MongoDB connection string
  - [ ] `JWT_SECRET` = Any random 32+ character string
  - [ ] `BOLNA_API_URL` = `https://api.bolna.ai`
  - [ ] `BOLNA_BEARER_TOKEN` = `bn-0397e2192bae4bf1917ab197010ddc1c`
  - [ ] `FRONTEND_URL` = Leave empty for now
- [ ] Click "Deploy"
- [ ] **Save backend URL** 📋 (e.g., `https://voice-dashboard-api.vercel.app`)
- [ ] Test: Visit `YOUR-BACKEND-URL/health`

## ☑️ Step 4: Update Frontend Config (2 min)

- [ ] Open `.env.production` in your project
- [ ] Update: `VITE_API_URL=YOUR-BACKEND-URL`
- [ ] Save file
- [ ] Commit and push to GitHub using GitHub Desktop

## ☑️ Step 5: Deploy Frontend (8 min)

- [ ] Go to [vercel.com/dashboard](https://vercel.com/dashboard)
- [ ] Click "Add New" → "Project"
- [ ] Import same repository again
- [ ] Project name: `voice-dashboard`
- [ ] Root directory: Leave as root
- [ ] Framework: Vite (auto-detected)
- [ ] Add environment variable:
  - [ ] `VITE_API_URL` = Your backend URL
- [ ] Click "Deploy"
- [ ] **Save frontend URL** 📋 (e.g., `https://voice-dashboard.vercel.app`)

## ☑️ Step 6: Connect Them (5 min)

- [ ] Go to backend project in Vercel
- [ ] Settings → Environment Variables
- [ ] Edit `FRONTEND_URL`
- [ ] Set value to your frontend URL
- [ ] Save
- [ ] Go to Deployments tab
- [ ] Click "..." on latest deployment → "Redeploy"

## ☑️ Step 7: Test Everything (5 min)

- [ ] Open your frontend URL
- [ ] Register a new account
- [ ] Login
- [ ] Add an agent (use any Bolna agent ID)
- [ ] Click "Sync from Bolna"
- [ ] Verify data appears

## ✅ You're Live!

Your Voice Dashboard is now deployed at:
- **Frontend**: `https://voice-dashboard.vercel.app` (your actual URL)
- **Backend**: `https://voice-dashboard-api.vercel.app` (your actual URL)

---

**Full detailed guide**: See `DEPLOY_BROWSER.md`

**Having issues?** Check the Troubleshooting section in DEPLOY_BROWSER.md
