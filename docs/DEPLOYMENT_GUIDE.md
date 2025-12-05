# CNCT Deployment Guide

This guide covers deploying both the frontend (React/Vite) and backend (Node.js/Express) to production.

## Table of Contents
1. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
2. [Backend Deployment (Railway)](#backend-deployment-railway)
3. [Post-Deployment Configuration](#post-deployment-configuration)
4. [Troubleshooting](#troubleshooting)

---

## Frontend Deployment (Vercel)

Vercel is the recommended hosting for Vite applications. It provides zero-config deployments, automatic CI/CD, and edge functions.

### Prerequisites
- GitHub account with your repository pushed
- Vercel account (free tier available)

### Step 1: Build Locally (Verify)
Before deploying, test the production build:

```bash
npm run build
npm run preview
```

This generates the `dist/` folder with optimized static files.

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel auto-detects Vite configuration

### Step 3: Configure Environment Variables

In Vercel dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add the following variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_BACKEND_URL=https://your-backend-on-railway.up.railway.app
```

> **Note:** Frontend env vars must start with `VITE_` to be accessible in browser

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete (~2-3 minutes)
3. Your site is live at `your-project.vercel.app`

### Step 5: Update Backend URL

Once your Railway backend is deployed (see next section), update the `VITE_BACKEND_URL` environment variable in Vercel to point to your Railway URL.

### Automatic Deployments

Every push to `main` branch automatically triggers a deployment. To disable, go to Settings → Git and disable auto-deploy.

### Custom Domain

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. SSL certificate auto-installed

---

## Backend Deployment (Railway)

Railway provides simple, git-based deployment for Node.js applications with automatic restarts and environment management.

### Prerequisites
- GitHub account
- Railway account (free tier: 500 hours/month)
- Backend code pushed to GitHub

### Step 1: Prepare Backend for Production

Ensure your `server/package.json` has a start script:

```json
{
  "scripts": {
    "dev": "npx tsx server.js",
    "start": "node server.js"
  }
}
```

> **Note:** Railway uses `npm start` to launch your app

### Step 2: Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account
5. Select your CNCT repository

### Step 3: Configure Service

1. Railway auto-detects Node.js
2. Set the **Root Directory** to `server` (if not auto-detected)
3. Click "Deploy"

Initial deployment takes ~2-3 minutes.

### Step 4: Set Environment Variables

Once deployed:

1. Go to your Railway project dashboard
2. Click on the deployment
3. Go to **Variables** tab
4. Add the following:

```
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SIGHTENGINE_USER=your_sightengine_user
SIGHTENGINE_SECRET=your_sightengine_secret
NODE_ENV=production
```

> **Important:** Get these values from:
> - Supabase: Project Settings → API
> - SightEngine: Your SightEngine account dashboard
> - .env file in your local server directory

### Step 5: Get Your Backend URL

1. In Railway dashboard, go to **Settings** → **Domains**
2. Railway auto-generates a URL: `your-project.up.railway.app`
3. Copy this URL - you'll need it for frontend configuration

### Step 6: Verify Deployment

Test your backend is running:

```bash
curl https://your-project.up.railway.app/
```

Should return:
```json
{
  "success": true,
  "message": "CNCT Backend API is running ✅"
}
```

Test database connection:

```bash
curl https://your-project.up.railway.app/test-db
```

Should return database connection status.

### Automatic Deployments

By default, Railway auto-deploys on every push to your main branch. To disable:
1. Go to **Settings** → **Deployments**
2. Toggle "Auto Deploy" off

---

## Post-Deployment Configuration

### Update Frontend with Backend URL

After backend is deployed on Railway:

1. In Vercel dashboard, go to your frontend project
2. **Settings** → **Environment Variables**
3. Update `VITE_BACKEND_URL`:
   ```
   VITE_BACKEND_URL=https://your-project.up.railway.app
   ```
4. Vercel auto-redeployes with the new variable

### Update CORS Settings (if needed)

In `server/server.js`, update CORS to allow your Vercel frontend:

```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-project.vercel.app'
    : '*'
}));
```

Redeploy backend after this change.

### Database Backups

Supabase automatically backs up your database. To view backups:
1. Go to Supabase dashboard
2. **Settings** → **Backups**
3. View backup history (7-day retention on free tier)

### Monitor Deployments

**Vercel:**
- Deployments tab shows history and logs
- Automatic rollback available for previous versions

**Railway:**
- Deployments tab shows status and logs
- View real-time logs in Monitor tab

---

## Troubleshooting

### Frontend Shows Blank Page

1. Check browser console for errors (F12)
2. Verify `VITE_BACKEND_URL` is correct in Vercel env vars
3. Check that backend is responding: `curl https://backend-url/`
4. Trigger rebuild in Vercel: **Deployments** → **Redeploy**

### Backend 500 Errors

1. Check Railway logs: **Monitor** tab
2. Verify all environment variables are set correctly
3. Ensure Supabase credentials are valid
4. Test locally: `npx tsx server.js`
5. Check SightEngine API status if using image moderation

### CORS Errors

Browser console shows: `Access to XMLHttpRequest has been blocked by CORS policy`

**Solutions:**
1. Verify `VITE_BACKEND_URL` matches your actual backend URL
2. Update CORS settings in `server/server.js`
3. Ensure backend environment variables are set
4. Restart Railway deployment

### Database Connection Fails

1. Check Supabase status: [status.supabase.com](https://status.supabase.com)
2. Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in Railway env vars
3. Test connection locally with same credentials
4. Check Supabase project is active (not paused)

### Slow Performance

**Frontend (Vercel):**
- Use Vercel Analytics to identify bottlenecks
- Check bundle size: `npm run build` and review dist/ folder

**Backend (Railway):**
- Check Railway CPU/Memory usage in Monitor
- Optimize database queries
- Consider upgrading to paid tier if consistently maxing out resources

### Deployment Won't Start

**Railway:**
1. Check the **Deployment** logs for error messages
2. Verify `PORT` environment variable is set to 5000
3. Ensure `start` script exists in package.json
4. Run locally to verify: `npm start`

---

## Summary Checklist

### Before First Deployment

- [ ] Push code to GitHub
- [ ] Test build locally: `npm run build && npm run preview`
- [ ] Verify .env has all required variables
- [ ] Update CORS settings if needed
- [ ] Test backend locally: `npm start` (from server folder)

### Frontend Deployment

- [ ] Create Vercel account
- [ ] Import GitHub repo to Vercel
- [ ] Set environment variables
- [ ] Deploy
- [ ] Verify live at `your-project.vercel.app`

### Backend Deployment

- [ ] Create Railway account
- [ ] Connect GitHub repo
- [ ] Set environment variables
- [ ] Deploy
- [ ] Get Railway URL
- [ ] Test endpoints: `/` and `/test-db`

### Post-Deployment

- [ ] Update frontend with backend URL
- [ ] Test API calls from frontend
- [ ] Monitor logs for errors
- [ ] Set up alerting (optional)

---

## Additional Resources

- [Vercel Docs](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Railway Docs](https://docs.railway.app)
- [Supabase Production Checklist](https://supabase.com/docs/guides/platform/going-into-prod)

For questions or issues, check deployment logs first, then consult the troubleshooting section above.
