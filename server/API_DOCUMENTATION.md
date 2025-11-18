# 🚀 CNCT Backend API

Base URL: `http://localhost:5000`

---

## Quick Reference

### Events
```bash
GET    /api/events              # Get all events
GET    /api/events/:id          # Get single event
POST   /api/events              # Create event
POST   /api/events/:id/toggle-attendance
GET    /api/events/:id/attendees
```

### Users
```bash
GET    /api/users/:id           # Get profile
GET    /api/users/:id/events    # User's events
GET    /api/users/:id/attending # Events attending
POST   /api/users/:id/settings  # Update settings
POST   /api/users/:id/tags/toggle
GET    /api/users/:id/tags
```

### Notifications
```bash
GET    /api/notifications/:userId
POST   /api/notifications/:id/mark-read
GET    /api/notifications/:userId/unread-count
```

### Tags
```bash
GET    /api/tags                # Get all tags
GET    /api/tags/:id            # Get specific tag
```

---

## Common Examples

### Create Event
```bash
POST /api/events
Content-Type: application/json

{
  "title": "Beach Volleyball",
  "description": "Come play!",
  "location": "FIU Beach",
  "event_date": "2025-12-01T14:00:00Z",
  "max_attendees": 15
}
```

### Get All Events
```bash
GET /api/events
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Beach Volleyball",
      "description": "Come play!",
      "location": "FIU Beach",
      "event_date": "2025-12-01T14:00:00Z",
      "max_attendees": 15,
      "created_at": "2025-11-17T10:00:00Z"
    }
  ]
}
```

### Toggle Attendance
```bash
POST /api/events/{event-id}/toggle-attendance
```

---

## Response Format

**Success:**
```json
{
  "success": true,
  "data": { /* ... */ }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message"
}
```

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Server Error

---

## Testing

**Health check:**
```bash
curl http://localhost:5000
```

**Database connection:**
```bash
curl http://localhost:5000/test-db
```

**Get events:**
```bash
curl http://localhost:5000/api/events
```

---

For detailed Supabase function docs, see `SUPABASE_FUNCTIONS.md`
