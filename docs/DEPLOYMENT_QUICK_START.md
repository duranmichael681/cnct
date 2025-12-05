# Deployment Quick Start (5 Minutes)

## Frontend to Vercel

```bash
# 1. Verify build works locally
npm run build

# 2. Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 3. In browser, go to vercel.com
# - Click "Add New Project"
# - Import your GitHub repo
# - Add environment variables:
#   VITE_SUPABASE_URL=<your_value>
#   VITE_SUPABASE_ANON_KEY=<your_value>
#   VITE_BACKEND_URL=<backend_url_here_after_step_5>
# - Click "Deploy"

# ✅ Frontend live at: https://your-project.vercel.app
```

## Backend to Railway

```bash
# 1. Push to GitHub (if not already done)
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. In browser, go to railway.app
# - Click "New Project"
# - Select "Deploy from GitHub repo"
# - Choose your repository
# - Set root directory to: server
# - Click "Deploy"

# 3. After deployment, go to Variables tab and add:
PORT=5000
SUPABASE_URL=<your_value>
SUPABASE_SERVICE_ROLE_KEY=<your_value>
SIGHTENGINE_USER=<your_value>
SIGHTENGINE_SECRET=<your_value>
NODE_ENV=production

# 4. Get your Railway URL from Settings → Domains
# Example: https://your-project.up.railway.app

# ✅ Backend live at: https://your-project.up.railway.app
```

## Connect Frontend to Backend

```bash
# 1. Copy your Railway URL from step 4 above
# 2. In Vercel dashboard, go to your project
# 3. Settings → Environment Variables
# 4. Update VITE_BACKEND_URL to your Railway URL
# 5. Vercel auto-redeploys ✅
```

## Verify Everything Works

```bash
# Test backend is responding
curl https://your-project.up.railway.app/

# Test frontend loads
# Visit https://your-project.vercel.app in browser
# Should load without errors
```

## Environment Variable References

**From Supabase:**
- Project Settings → API → URL (SUPABASE_URL)
- Project Settings → API → anon public key (VITE_SUPABASE_ANON_KEY)
- Project Settings → API → service_role key (SUPABASE_SERVICE_ROLE_KEY)

**From SightEngine:**
- Dashboard → API Credentials → User ID (SIGHTENGINE_USER)
- Dashboard → API Credentials → Secret Key (SIGHTENGINE_SECRET)

---

**Need Help?** See the full DEPLOYMENT_GUIDE.md for troubleshooting.
