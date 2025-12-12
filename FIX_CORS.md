# Fix CORS and API Path Issues

If you're seeing "500 Internal Server Error" on OPTIONS requests or CORS errors, follow these steps:

## Issue 1: CORS Preflight Failing

### Fix in Vercel Dashboard:

1. **Go to Backend Project** → Settings → Environment Variables
2. **Add your frontend URL**:
   - Name: `FRONTEND_URL`
   - Value: `https://voice-dashboard-client.vercel.app` (YOUR actual URL)
3. **Redeploy backend**:
   - Deployments tab → Click "..." on latest → "Redeploy"

## Issue 2: API Route Path

The frontend needs to call `/api/auth/login` not `/auth/login`.

### Already Fixed:
✅ Updated `src/services/api.js` to include `/api` prefix

## Quick Fix Deployment:

1. **Commit and push changes**:
   ```bash
   git add .
   git commit -m "Fix CORS and API paths"
   git push
   ```

2. **Or using GitHub Desktop**:
   - See changed files
   - Commit with message: "Fix CORS and API paths"
   - Push to origin

3. **Vercel will auto-deploy** both frontend and backend

4. **Wait 2-3 minutes** for deployments to complete

## Verify Fix:

1. Open your frontend URL
2. Try to login
3. Should work without CORS errors!

## If Still Having Issues:

### Check Backend Logs:
1. Vercel Dashboard → Backend Project → Deployments
2. Click latest deployment → Functions tab
3. Look for CORS-related errors

### Verify Environment Variables:
1. Backend Settings → Environment Variables
2. Check `FRONTEND_URL` is set correctly
3. Should match your actual frontend URL exactly

### Common Mistakes:
- ❌ `FRONTEND_URL` has trailing slash: `https://app.vercel.app/`
- ✅ Correct: `https://app.vercel.app`
- ❌ Wrong frontend URL
- ✅ Copy exact URL from Vercel frontend project
