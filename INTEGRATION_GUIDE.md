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
import { getAllEvents, createEvent, toggleEventAttendance } from './services/api';

// Get events
const events = await getAllEvents();

// Create event
await createEvent({
  title: 'Beach Volleyball',
  description: 'Come play!',
  location: 'FIU Beach',
  event_date: '2025-12-01T14:00:00Z',
  max_attendees: 15,
});

// Join/leave
await toggleEventAttendance(eventId);
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Failed to load events" | Start backend: `cd server && npm run dev` |
| CORS errors | Ensure backend runs on port 5000 |
| TypeScript errors | Run `npm install` |

---

## Documentation

- **API Reference:** `server/API_DOCUMENTATION.md`
- **Supabase Functions:** `SUPABASE_FUNCTIONS.md`
- **UI Components:** `src/components/ui/UIComponents.tsx`
- **Utilities:** `src/utils/helpers.ts`
