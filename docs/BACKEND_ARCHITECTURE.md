# 🏗️ CNCT Backend Architecture Design

## Overview

This document outlines the backend architecture for CNCT, a social event platform for FIU students. We use a **Layered Architecture** pattern with Express.js and Supabase to ensure scalability, maintainability, and clear separation of concerns.

---

## 🎯 Architecture Diagram

https://excalidraw.com/#json=KLm8GHkA8p921qGEkOeuA,Lgf7R-EHszyTbOuSTMKYIg

### Layer Explanations

#### 1. **React Frontend** (Vite + TypeScript)
- **What it does**: User interface where students create accounts, browse events, join plans, and send messages
- **Responsibilities**: 
  - Display data to users
  - Collect user input (forms, clicks)
  - Send HTTP requests to backend API
  - Handle real-time updates via Supabase subscriptions
- **Communication**: Sends REST API requests (GET, POST, PUT, DELETE) to Express server

#### 2. **Routes Layer** (`/api/posts`, `/api/users`, `/api/messages`)
- **What it does**: Entry point for all API requests — defines available endpoints
- **Responsibilities**:
  - Map HTTP methods to controller functions (e.g., `POST /api/posts` → `createPost`)
  - Apply middleware before passing requests forward
  - Organize endpoints by resource (posts, users, messages)
- **Example**: `router.post('/posts', authMiddleware, PostControllerModule.createPostController)`
- **Implementation**: TypeScript routes with controller modules for type safety and maintainability

#### 3. **Middleware Layer**
- **What it does**: Gatekeepers that intercept requests before they reach controllers
- **Responsibilities**:
  - **Authentication**: Verify JWT tokens, ensure user is logged in
  - **Validation**: Check request data is valid (correct format, required fields)
  - **Error Handling**: Catch errors and format consistent responses
  - **Moderation**: Filter inappropriate content
  - **Rate Limiting**: Prevent spam and abuse
- **Key Point**: Requests can be rejected here if they don't pass checks

#### 4. **Controllers Layer**
- **What it does**: Traffic directors — handle HTTP requests and responses
- **Responsibilities**:
  - Extract data from requests (`req.body`, `req.params`, `req.user`)
  - Call appropriate service functions
  - Format responses to send back to frontend
  - Handle HTTP status codes (200, 201, 400, 404, 500)
- **Important**: Controllers do NOT contain business logic — they just coordinate

#### 5. **Services Layer**
- **What it does**: Business logic brain — contains all the "what should happen" rules
- **Responsibilities**:
  - Implement complex workflows (e.g., "Can user join event?")
  - Perform multi-step operations (create event → send notifications)
  - Apply business rules (capacity checks, date validations)
  - Call repositories to interact with database
  - Orchestrate between multiple repositories if needed
- **Key Point**: This is where your app's unique logic lives

#### 6. **Repositories Layer**
- **What it does**: Database handlers — only talks to Supabase
- **Responsibilities**:
  - Execute database queries (SELECT, INSERT, UPDATE, DELETE)
  - Return raw data from database
  - Abstract database operations from services
  - Handle database errors
- **Important**: NO business logic here — just pure data operations

#### 7. **Supabase Backend**
- **What it does**: Managed backend infrastructure (database + services)
- **Components**:
  - **PostgreSQL Database**: Stores all data (users, events, messages, attendees)
  - **Realtime Subscriptions**: Push live updates to frontend (new messages, attendees)
  - **Storage**: Hosts profile pictures and event images
  - **Auth**: Manages user authentication with JWT tokens
- **Benefits**: Handles scaling, backups, and security automatically

---

## 📁 Folder Structure

```
server/
├── config/
│   ├── supabase.js              # Supabase client configuration
│   └── supabase.ts              # TypeScript Supabase config
│
├── middleware/
│   ├── auth.js                  # JWT authentication
│   ├── errorHandler.js          # Global error handling
│   ├── moderate.js              # Content filtering
│   └── notFound.js              # 404 handler
│
├── routes/
│   ├── index.ts                 # Main router (TypeScript)
│   ├── posts.ts                 # Post-related routes (TypeScript)
│   ├── users.js                 # User profile routes
│   ├── Messages.ts              # Messaging routes
│   ├── comments.js              # Comment routes
│   ├── profiles.ts              # Profile routes
│   ├── notifications.js         # Notification routes
│   ├── tags.js                  # Tag routes
│   └── storage.js               # Storage routes
│
├── controllers/
│   ├── controller-module.ts     # Controller module exports
│   └── posts/
│       ├── create-post-controller.ts
│       ├── fetch-posts-controller.ts
│       ├── fetch-post-by-id-controller.ts
│       ├── update-post-controller.ts
│       ├── delete-post-controller.ts
│       └── toggle-attendance-controller.ts
│
├── services/
│   └── posts/
│       ├── create-post-service.ts
│       ├── fetch-posts-service.ts
│       ├── fetch-post-by-id-service.ts
│       ├── update-post-service.ts
│       └── delete-post-service.ts
│
├── repositories/
│   ├── profiles/                # Profile database operations
│   └── notifications/           # Notification database operations
│
├── types/
│   └── express.d.ts             # TypeScript type definitions
│
├── .env                         # Environment variables
├── server.js                    # Server entry point
└── package.json                 # Dependencies
```

---

## 🔄 Request Flow Example

### Creating a Post

```
1. User submits "Create Post" form from React frontend
   ↓
2. POST /api/posts
   ↓
3. Authentication Middleware (authMiddleware)
   • Verifies Supabase JWT token from Authorization header
   • Extracts user ID and attaches to req.user
   • Returns 401 if not authenticated
   ↓
4. Create Post Controller (createPostController)
   • Receives authenticated request
   • Validates required fields (title, body, start_date)
   • Verifies user exists in database
   • Moderates post picture if provided
   • Calls createPostService(postData)
   ↓
5. Create Post Service
   • Inserts post into database with organizer_id = req.user.id
   • If tag_ids provided, inserts into post_tags junction table
   • Returns new post object
   ↓
6. Controller formats response
   • Returns 201 Created status
   • Logs success with post ID
   ↓
7. Response sent back to React frontend
   { success: true, data: { id, title, body, created_at, ... } }
```

---

## 🛡️ Middleware Details

### Authentication Middleware (`auth.js`)
- **Purpose**: Verify user identity on protected routes
- **How**: Validates Supabase JWT token from request headers
- **Returns**: User object attached to `req.user` or 401 error

### Validation Middleware (`validation.js`)
- **Purpose**: Validate incoming data before processing
- **How**: Uses validation schemas (e.g., Joi, Zod)
- **Returns**: Validated data or 400 error with details

### Error Handler (`errorHandler.js`)
- **Purpose**: Catch and format all errors consistently
- **How**: Global Express error middleware
- **Returns**: Structured JSON error response

### Moderation Middleware (`moderation.js`)
- **Purpose**: Filter inappropriate content in messages/posts
- **How**: Check against banned words, offensive content
- **Returns**: Sanitized content or 403 error

### Rate Limiter (`rateLimiter.js`)
- **Purpose**: Prevent API abuse and spam
- **How**: Track requests per user/IP (e.g., using express-rate-limit)
- **Returns**: 429 error if limit exceeded

---

## 🎯 API Endpoints Design

### Posts API

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/posts` | Get all posts (with optional ?userId for tag filtering) | No |
| `GET` | `/api/posts/:id` | Get specific post | No |
| `POST` | `/api/posts` | Create new post | Yes |
| `PUT` | `/api/posts/:id` | Update post | Yes (organizer only) |
| `DELETE` | `/api/posts/:id` | Delete post | Yes (organizer only) |
| `POST` | `/api/posts/:id/toggle-attendance` | Toggle RSVP for post | Yes |
| `POST` | `/api/posts/:id/leave` | Leave a post | Yes |
| `GET` | `/api/posts/:id/attendees` | Get attendee list | No |

### Users API

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/users/:id` | Get user profile | No |
| `PUT` | `/api/users/:id` | Update profile | Yes (self) |
| `GET` | `/api/users/:id/events` | Get user's events | No |
| `POST` | `/api/users/:id/friend` | Add friend | Yes |

### Messages API

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/messages/threads/:eventId` | Get event thread | Yes |
| `POST` | `/api/messages` | Send message | Yes |
| `PUT` | `/api/messages/:id` | Edit message | Yes (owner) |
| `DELETE` | `/api/messages/:id` | Delete message | Yes (owner) |

---

## 🔥 Real-time Features

### Using Supabase Realtime

**Live Attendee Updates**
```javascript
// Frontend subscribes to attendee changes
supabase
  .channel('attendees')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'attendees' },
    (payload) => {
      // Update UI with new attendee
    }
  )
  .subscribe()
```

**Live Messaging**
```javascript
// Frontend subscribes to message thread
supabase
  .channel(`event-${eventId}`)
  .on('postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'messages' },
    (payload) => {
      // Display new message instantly
    }
  )
  .subscribe()
```

---

## 🗄️ Database Schema Overview

### Tables

**users**
- `id` (UUID, primary key)
- `email` (string, unique)
- `first_name` (string)
- `last_name` (string)
- `profile_picture_url` (string)
- `bio` (text)
- `created_at` (timestamp)

**posts**
- `id` (UUID, primary key)
- `organizer_id` (UUID, foreign key → users) - Who created the post
- `title` (string)
- `body` (text)
- `building` (string, nullable) - FIU building location
- `start_date` (timestamp)
- `end_date` (timestamp, nullable)
- `post_picture_url` (string, nullable)
- `is_private` (boolean, default false)
- `created_at` (timestamp)

**attendees**
- `id` (UUID, primary key)
- `post_id` (UUID, foreign key → posts) - Which post
- `user_id` (UUID, foreign key → users) - Who is attending (RSVP)
- `created_at` (timestamp)
- Unique constraint: (post_id, user_id)

**comments**
- `id` (UUID, primary key)
- `post_id` (UUID, foreign key → posts)
- `user_id` (UUID, foreign key → users)
- `body` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp, nullable)

**tags**
- `id` (integer, primary key)
- `code` (string, unique) - Tag name/code

**post_tags**
- `id` (UUID, primary key)
- `post_id` (UUID, foreign key → posts)
- `tag_id` (integer, foreign key → tags)
- Unique constraint: (post_id, tag_id)

**friendships** (future feature)
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key → users)
- `friend_id` (UUID, foreign key → users)
- `created_at` (timestamp)

---

## 🔐 Security Considerations

### Authentication
- Use Supabase Auth for JWT token management
- Validate tokens on every protected route
- Store tokens securely in frontend (httpOnly cookies or secure storage)

### Authorization
- Implement role-based access control (RBAC)
- Check ownership before allowing updates/deletes
- Moderators can delete any inappropriate content

### Data Validation
- Validate all inputs server-side (never trust client)
- Sanitize user-generated content (XSS prevention)
- Use parameterized queries (SQL injection prevention)

### Rate Limiting
- Limit API requests per user/IP
- Prevent spam in messaging
- Throttle event creation

### Content Moderation
- Filter profanity and inappropriate content
- Flag suspicious activity for manual review
- Allow users to report content

---

## 🚀 Scalability Strategies

### Current Phase (MVP)
- Single Express server
- Supabase managed database
- Realtime via Supabase subscriptions

### Future Enhancements
- **Caching**: Add Redis for frequently accessed data (event lists, user profiles)
- **CDN**: Serve images via Cloudflare or AWS CloudFront
- **Load Balancing**: Multiple Express instances behind a load balancer
- **Message Queue**: Use Bull/BullMQ for background jobs (notifications, email)
- **Microservices**: Separate messaging service if it grows complex
- **Search**: Implement Elasticsearch for advanced event search

---

## 🧪 Testing Strategy

### Unit Tests
- Test services and repositories independently
- Mock Supabase client for isolated tests
- Use Jest or Mocha

### Integration Tests
- Test full request flow (route → controller → service → repository)
- Use test database or Supabase local instance
- Verify middleware behavior

### End-to-End Tests
- Test complete user workflows
- Use Postman, Insomnia, or automated scripts
- Simulate real user scenarios

---

## 📦 Key Dependencies

```json
{
  "express": "^4.18.0",
  "@supabase/supabase-js": "^2.0.0",
  "dotenv": "^16.0.0",
  "cors": "^2.8.5",
  "helmet": "^7.0.0",
  "express-rate-limit": "^6.0.0",
  "joi": "^17.0.0",           // Input validation
  "morgan": "^1.10.0"         // HTTP request logging
}
```

---

## 🎓 Best Practices

1. **Keep layers independent**: Controllers shouldn't know about database details
2. **Single Responsibility**: Each function does ONE thing well
3. **Error handling**: Always handle errors gracefully and return meaningful messages
4. **Logging**: Log important events (errors, auth failures, suspicious activity)
5. **Environment variables**: Never hardcode secrets or URLs
6. **Code reviews**: Have teammates review backend changes
7. **Documentation**: Comment complex business logic
8. **Version control**: Use meaningful commit messages

---

## 🛠️ Development Workflow

1. **Create route** → Define endpoint in routes folder (TypeScript preferred: `posts.ts`)
2. **Add middleware** → Apply authMiddleware for protected routes
3. **Build controller** → Create controller in `controllers/posts/` directory
4. **Write service** → Implement business logic in `services/posts/` directory
5. **Database operations** → Use Supabase client directly in service layer
6. **Test endpoint** → Use Postman/Insomnia or frontend integration
7. **Document** → Update API docs and architecture documentation

### TypeScript Architecture Pattern

**Current Implementation:**
- Routes: `routes/posts.ts` → Imports controller module
- Controllers: `controllers/posts/*.ts` → Handles HTTP, calls services
- Services: `services/posts/*.ts` → Business logic, database operations
- Types: Shared interfaces (e.g., `Post`, `postData`)

**Benefits:**
- Type safety catches errors at compile time
- Better IDE autocomplete and refactoring
- Self-documenting code with TypeScript interfaces
- Consistent field naming (using snake_case for database fields)

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [REST API Best Practices](https://restfulapi.net/)
- [Node.js Security Checklist](https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html)

---

**Questions or suggestions?** Reach out to Jose or Jorge (co-leads)! 🚀
