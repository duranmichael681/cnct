# 🚀 CNCT Backend API

Base URL: `http://localhost:5000`

---

## Quick Reference

### Posts
```bash
GET    /api/posts              # Get all posts
GET    /api/posts/:id          # Get single post
POST   /api/posts              # Create post
POST   /api/posts/:id/toggle-attendance
GET    /api/posts/:id/attendees
```

### Users
```bash
GET    /api/users/:id           # Get profile
GET    /api/users/:id/posts    # User's posts
GET    /api/users/:id/attending # Posts attending
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

### Create Post
```bash
POST /api/posts
Content-Type: application/json

{
  "title": "Beach Volleyball",
  "description": "Come play!",
  "location": "FIU Beach",
  "event_date": "2025-12-01T14:00:00Z",
  "max_attendees": 15
}
```

### Get All Posts
```bash
GET /api/posts
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
POST /api/posts/{post-id}/toggle-attendance
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

**Get posts:**
```bash
curl http://localhost:5000/api/posts
```

---

For detailed Supabase function docs, see `SUPABASE_FUNCTIONS.md`
