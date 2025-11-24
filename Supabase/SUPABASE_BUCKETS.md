# 📦 Supabase Storage Configuration Guide

This document covers the storage buckets used in CNCT and how to configure them properly.

## Active Buckets

| Bucket Name | Purpose | Status | Public | Size Limit | MIME Types |
|-------------|---------|--------|--------|------------|------------|
| `posts_picture` | Event/post cover images | ✅ Active | ✅ **Public** | 5MB | image/jpeg, image/png, image/webp |
| `profile_pictures` | User profile avatars | ✅ Active | ✅ **Public** | 2MB | image/jpeg, image/png, image/webp |

> **Note**: Old draft names like `event-images`, `post-images`, `profile-pictures` are NOT used in the codebase. Only `posts_picture` and `profile_pictures` are referenced.

> **Implementation**: Both buckets are configured as **public** for simplified access and better performance. See [Public vs Private Trade-offs](#public-vs-private-trade-offs) below for rationale.

---

## Storage Endpoint

```
https://dzfnvmwepmukenpsdfsy.storage.supabase.co/storage/v1/s3
```

---

## Creating the `profile_pictures` Bucket

> **Current Status**: ✅ Already created as a **public bucket** following the recommendations below.

### Recommended Settings

When creating buckets in your Supabase dashboard (already applied to our buckets):

| Setting | Value | Rationale |
|---------|-------|-----------|
| **Bucket name** | `profile_pictures` | Matches code references (snake_case) |
| **Public bucket** | ✅ **ENABLED** | Profile pictures are typically public for fast, cacheable access without signed URLs |
| **Restrict file size** | ✅ **ENABLED** (2MB max) | Prevents accidentally large uploads; avatars rarely need more |
| **Restrict MIME types** | ✅ **ENABLED** | Only allow: `image/jpeg`, `image/png`, `image/webp` (optional: `image/avif` for modern formats) |

### Public vs Private Trade-offs

**Public bucket (✅ our choice):**
- ✅ Direct URL access (no signed URL generation needed)
- ✅ Better caching and CDN performance
- ✅ Simpler frontend code
- ✅ Lower backend overhead
- ❌ Anyone with the URL can view the image

**Private bucket (alternative approach):**
- ✅ More control over who can access images
- ✅ Can expire URLs
- ❌ Requires signed URL generation (backend overhead)
- ❌ More complex implementation
- ❌ Slower performance (no CDN caching)

**Why we chose public**: For profile pictures and post images, privacy isn't a major concern since they're meant to be shared publicly on the platform. The performance and simplicity benefits outweigh the minimal privacy trade-off.

---

## File Naming Convention

### Profile Pictures

Store each user's avatar at a predictable path for easy overwrites:

```
profile_pictures/{user_id}/avatar.jpg
```

**Example:**
```
profile_pictures/550e8400-e29b-41d4-a716-446655440000/avatar.jpg
```

### With Versioning (Optional)

If you want to keep old versions:

```
profile_pictures/{user_id}/avatar_{timestamp}.jpg
```

**Example:**
```
profile_pictures/550e8400-e29b-41d4-a716-446655440000/avatar_2025-11-18T20-15-00Z.jpg
```

### Post Pictures

Already in use:

```
posts_picture/{post_id}/{filename}.jpg
```

Or simpler:
```
posts_picture/{uuid}.jpg
```

---

## Row Level Security (RLS) Policies

### Current Setup (Public Buckets)

Since both `posts_picture` and `profile_pictures` are **public buckets**, no RLS policies are required for **read access**. The bucket's public setting allows anyone to view images via their URLs.

**Benefits of our public bucket approach:**
- No RLS policies needed for reads
- Direct URL access (e.g., `https://...supabase.co/storage/v1/object/public/posts_picture/image.jpg`)
- Automatic CDN caching
- Lower database load

### Optional: Upload Restrictions (If Using Direct Client Uploads)

If you want to allow direct client uploads (using anon key) but restrict users to only upload to their own folders, you can add insert/update policies:

```sql
-- Ensure RLS is enabled
alter table storage.objects enable row level security;

-- Allow authenticated users to upload ONLY to their own folder
create policy "Users can upload their own avatar"
on storage.objects for insert
with check (
  bucket_id = 'profile_pictures'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update/replace their own avatar
create policy "Users can update their own avatar"
on storage.objects for update
using (
  bucket_id = 'profile_pictures'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own avatar
create policy "Users can delete their own avatar"
on storage.objects for delete
using (
  bucket_id = 'profile_pictures'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);
```

**Note**: We currently upload via backend (service role), which bypasses RLS entirely. These policies are only needed if you switch to direct client-side uploads.

### Alternative: Private Bucket Setup (For Reference)

If you ever need to switch to private buckets (not currently used), you would need:

Add a select policy if you want public read but private write:

```sql
-- Allow anyone to view avatars
create policy "Public read avatars"
on storage.objects for select
using ( bucket_id = 'profile_pictures' );
```

---

## Upload Flow

### Current Implementation (posts_picture)

1. User selects image in `CreatePage.tsx`
2. Image is base64 encoded
3. Uploaded via backend `/api/storage/upload` (service role)
4. Backend returns public URL
5. URL stored in `posts.post_picture_url`

### Planned Profile Picture Flow

**Option A: Backend Upload (Recommended for consistency)**

1. User selects avatar image
2. Frontend compresses/resizes (optional, using `browser-image-compression`)
3. Upload via backend `/api/storage/upload` endpoint
4. Backend uses service role (bypasses RLS)
5. Store URL in `users.profile_picture_url`

**Option B: Direct Client Upload**

1. User selects avatar image
2. Frontend uploads directly using Supabase client (anon key)
3. RLS policies enforce user can only upload to their own folder
4. Store URL in `users.profile_picture_url`

Backend upload (Option A) is simpler and more secure since service role bypasses RLS.

---

## Environment Variables

### Frontend (`.env.local`)

```bash
VITE_POSTS_BUCKET=posts_picture
VITE_PROFILE_BUCKET=profile_pictures
```

### Backend (`server/.env`)

```bash
POSTS_BUCKET=posts_picture
PROFILE_BUCKET=profile_pictures
```

---

## Code Integration Checklist

- [x] Create `posts_picture` bucket in Supabase dashboard (✅ Public)
- [x] Create `profile_pictures` bucket in Supabase dashboard (✅ Public)
- [x] Configure bucket settings (public, size limit, MIME types)
- [ ] Add `VITE_PROFILE_BUCKET=profile_pictures` to frontend `.env.local`
- [ ] Add `PROFILE_BUCKET=profile_pictures` to backend `server/.env` (if needed)
- [ ] Create avatar upload component (or reuse existing `ImageUpload.tsx`)
- [ ] Update user profile page to show avatar
- [ ] Add fallback UI when `profile_picture_url` is null (e.g., initials circle)
- [ ] (Optional) Add image compression before upload
- [ ] (Optional) Add RLS policies if switching to direct client uploads

---

## Display Fallbacks

When `profile_picture_url` is `null` or fails to load, show:

1. **Initials circle** (e.g., "JD" for John Doe)
2. **Default avatar icon** (generic user silhouette)
3. **Gradient placeholder** with user's initials

Example React component:

```tsx
function Avatar({ user }: { user: User }) {
  const initials = `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();
  
  return user.profile_picture_url ? (
    <img 
      src={user.profile_picture_url} 
      alt={`${user.first_name}'s avatar`}
      className="w-10 h-10 rounded-full object-cover"
      onError={(e) => {
        // Fallback to initials on error
        e.currentTarget.style.display = 'none';
      }}
    />
  ) : (
    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
      {initials || '?'}
    </div>
  );
}
```

---

## Troubleshooting

### "Bucket not found" error

- Verify bucket name matches exactly: `profile_pictures` (not `profile-pictures`)
- Check bucket exists in Supabase dashboard
- Ensure env var `VITE_PROFILE_BUCKET` is set and matches

### Upload fails with RLS error

- If using direct client upload, ensure RLS policies are created
- If using backend upload, ensure `SUPABASE_SERVICE_ROLE_KEY` is set (bypasses RLS)
- Check bucket permissions in Supabase dashboard

### Images don't load

- If bucket is private, ensure you're generating signed URLs
- If bucket is public, verify the URL format is correct
- Check browser console for CORS errors
- Verify `profile_picture_url` in database is a valid URL

### File size too large

- Frontend: Add pre-upload size check and show user-friendly error
- Backend: Bucket size limit will reject; ensure error handling shows clear message
- Consider adding client-side compression with `browser-image-compression`

---

## Next Steps

1. **Create the bucket** with settings above
2. **Add env variables** to both frontend and backend
3. **Test upload flow** with a simple form
4. **Add RLS policies** if using direct client uploads
5. **Implement avatar display** component with fallbacks
6. **Add compression** (optional) for better performance

For implementation help, see:
- `src/pages/CreatePage.tsx` - Example of image upload flow
- `src/services/api.ts` - `uploadFileToStorage()` function
- `server/routes/storage.js` - Backend upload endpoint
