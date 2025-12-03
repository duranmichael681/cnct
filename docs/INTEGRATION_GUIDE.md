# 🔗 Integration Guide

## Quick Start

```bash
# Backend
cd server && npm run dev

# Frontend (new terminal)
npm run dev
```

**Data Flow:** React (5174) → Express (5000) → Supabase

---

## API Usage

```typescript
import { getAllPosts, createPost, togglePostAttendance } from './services/api';

// Get posts
const posts = await getAllPosts();

// Create post
await createPost({
  title: 'Beach Volleyball',
  body: 'Come play!',
  building: 'FIU Beach',
  start_date: '2025-12-01T14:00:00Z',
  organizer_id: 'user-id',
});

// Join/leave
await togglePostAttendance(postId, userId);
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Failed to load posts" | Start backend: `cd server && npm run dev` |
| CORS errors | Ensure backend runs on port 5000 |
| TypeScript errors | Run `npm install` |

---

## Documentation

- **API Reference:** `server/API_DOCUMENTATION.md`
- **Supabase Functions:** `SUPABASE_FUNCTIONS.md`
- **UI Components:** `src/components/ui/UIComponents.tsx`
- **Utilities:** `src/utils/helpers.ts`
