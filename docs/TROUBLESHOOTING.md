# Troubleshooting Guide

## Image URLs Not Working

### Problem
Images upload successfully to Supabase storage, but the URL saved in the `posts` table doesn't display the image.

### Root Cause
The storage bucket is likely set to **private** instead of **public**.

### Solution

1. **Go to Supabase Dashboard:**
   - Navigate to: https://supabase.com/dashboard
   - Select your project
   - Go to **Storage** in the left sidebar

2. **Check Bucket Settings:**
   - Find the `posts_picture` bucket
   - Click the 3-dot menu (⋮) next to the bucket name
   - Select **Edit bucket**

3. **Make Bucket Public:**
   - Toggle **Public bucket** to **ON**
   - Save the changes

4. **Verify Public Access:**
   - The public URL format should be:
     ```
     https://dzfnvmwepmukenpsdfsy.supabase.co/storage/v1/object/public/posts_picture/filename.jpg
     ```
   - NOT:
     ```
     https://dzfnvmwepmukenpsdfsy.supabase.co/storage/v1/object/sign/posts_picture/filename.jpg
     ```

### Alternative: Use Signed URLs (If you want to keep bucket private)

If you want to keep the bucket private and use signed URLs instead:

1. **Update storage route** (`server/routes/storage.js`):
```javascript
// Instead of getPublicUrl, use createSignedUrl
const { data: urlData, error: urlError } = await supabaseAdmin.storage
    .from(bucket)
    .createSignedUrl(data.path, 31536000); // Valid for 1 year

if (urlError) throw urlError;

res.json({
    success: true,
    data: {
        path: data.path,
        url: urlData.signedUrl,
    }
});
```

2. **Note:** Signed URLs expire after the specified time (1 year in example above)

### Quick Test

After making bucket public, try this in your browser:
```
https://dzfnvmwepmukenpsdfsy.supabase.co/storage/v1/object/public/posts_picture/YOUR_IMAGE_FILENAME.jpg
```

If you see the image, the bucket is now public and URLs should work!

---

## Database Not Syncing Users

### Problem
Error: "User account not found in database" even though you're logged in.

### Solution
See `Supabase/SUPABASE_FUNCTIONS.MD` - section "User account not found in database" for detailed fix.

---

## CORS Errors

### Problem
Frontend can't connect to backend.

### Solution
1. Make sure backend is running: `cd server && npm run dev`
2. Verify backend is on port 5000
3. Check frontend `.env.local` has: `VITE_API_URL=http://localhost:5000/api`

---

## Environment Variables Not Loading

### Problem
`undefined` errors for environment variables.

### Solution
1. **Backend:** Variables should be in `server/.env` (no `.local`)
2. **Frontend:** Variables should be in `.env.local` (in project root)
3. Restart both dev servers after changing .env files
4. Verify variable names:
   - Backend: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
   - Frontend: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (note the `VITE_` prefix!)
