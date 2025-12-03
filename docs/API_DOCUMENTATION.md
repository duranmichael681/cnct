# 🚀 CNCT Backend API

Base URL: `http://localhost:5000`

---

## Quick Reference

### Posts
```bash
GET    /api/posts              # Get all posts (with optional ?userId=xxx for tag filtering)
GET    /api/posts/:id          # Get single post
POST   /api/posts              # Create post (requires auth)
PUT    /api/posts/:id          # Update post (requires auth, organizer only)
DELETE /api/posts/:id          # Delete post (requires auth, organizer only)
POST   /api/posts/:id/toggle-attendance  # Toggle RSVP (requires auth)
POST   /api/posts/:id/leave    # Leave post (requires auth)
GET    /api/posts/:id/attendees # Get attendees list
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
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Beach Volleyball",
  "body": "Come play volleyball with us at the beach!",
  "building": "BBC",
  "start_date": "2025-12-01T14:00:00Z",
  "end_date": "2025-12-01T16:00:00Z",
  "is_private": false,
  "post_picture_url": "https://...",
  "tag_ids": [1, 5, 8]
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Beach Volleyball",
    "body": "Come play volleyball with us at the beach!",
    "created_at": "2025-11-17T10:00:00Z"
  }
}
```

### Get All Posts
```bash
GET /api/posts
# Or with tag filtering:
GET /api/posts?userId=<user-uuid>
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "organizer_id": "user-uuid",
      "title": "Beach Volleyball",
      "body": "Come play volleyball with us at the beach!",
      "building": "BBC",
      "start_date": "2025-12-01T14:00:00Z",
      "end_date": "2025-12-01T16:00:00Z",
      "is_private": false,
      "post_picture_url": "https://...",
      "created_at": "2025-11-17T10:00:00Z",
      "users": {
        "id": "user-uuid",
        "first_name": "John",
        "last_name": "Doe",
        "profile_picture_url": "https://..."
      },
      "attendees": [{ "count": 5 }],
      "comments": [{ "count": 3 }]
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
