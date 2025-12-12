# Quick Deployment Steps

Follow these steps in order:

## 1️⃣ Setup MongoDB Atlas (10 minutes)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create FREE M0 cluster
3. Create database user with password
4. Add IP: `0.0.0.0/0` (Allow from anywhere)
5. Get connection string and save it

## 2️⃣ Deploy Backend (5 minutes)

```bash
# Install Vercel CLI
npm install -g vercel

# Go to backend folder
cd backend

# Login
vercel login

# Deploy
vercel

# Add environment variables
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add BOLNA_API_URL
vercel env add BOLNA_BEARER_TOKEN

# Deploy to production
vercel --prod
```

**Save your backend URL**: `https://your-backend.vercel.app`

## 3️⃣ Deploy Frontend (5 minutes)

```bash
# Go back to root
cd ..

# Update .env.production with your backend URL
# VITE_API_URL=https://your-backend.vercel.app

# Deploy
vercel

# Add environment variable
vercel env add VITE_API_URL

# Deploy to production
vercel --prod
```

**Save your frontend URL**: `https://your-frontend.vercel.app`

## 4️⃣ Update Backend CORS (2 minutes)

```bash
# In Vercel Dashboard
# Go to: Backend Project > Settings > Environment Variables
# Add: FRONTEND_URL = https://your-frontend.vercel.app

# Redeploy
cd backend
vercel --prod
```

## ✅ Done!

Open `https://your-frontend.vercel.app` and test!

---

**Full detailed guide**: See `VERCEL_DEPLOYMENT.md`

## Environment Variables Needed

### Backend
- `MONGODB_URI` - From MongoDB Atlas
- `JWT_SECRET` - Any random string (32+ chars)
- `BOLNA_API_URL` - `https://api.bolna.ai`
- `BOLNA_BEARER_TOKEN` - `bn-0397e2192bae4bf1917ab197010ddc1c`
- `FRONTEND_URL` - Your Vercel frontend URL (add after frontend deployment)

### Frontend
- `VITE_API_URL` - Your Vercel backend URL
