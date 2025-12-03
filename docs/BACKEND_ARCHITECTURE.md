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

#### 2. **Routes Layer** (`/api/events`, `/api/users`, `/api/messages`)
- **What it does**: Entry point for all API requests — defines available endpoints
- **Responsibilities**:
  - Map HTTP methods to controller functions (e.g., `POST /api/events` → `createEvent`)
  - Apply middleware before passing requests forward
  - Organize endpoints by resource (events, users, messages)
- **Example**: `router.post('/events', authenticateUser, validateEvent, eventController.createEvent)`

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
│   └── supabase.js              # Supabase client configuration
│
├── middleware/
│   ├── auth.js                  # JWT authentication
│   ├── validation.js            # Input validation
│   ├── errorHandler.js          # Global error handling
│   ├── moderation.js            # Content filtering
│   └── rateLimiter.js           # API rate limiting
│
├── routes/
│   ├── index.js                 # Main router
│   ├── events.js                # Event-related routes
│   ├── users.js                 # User profile routes
│   ├── messages.js              # Messaging routes
│   └── attendees.js             # Event attendee routes
│
├── controllers/
│   ├── eventController.js       # Event request handlers
│   ├── userController.js        # User request handlers
│   ├── messageController.js     # Message request handlers
│   └── attendeeController.js    # Attendee request handlers
│
├── services/
│   ├── eventService.js          # Event business logic
│   ├── messageService.js        # Messaging logic
│   ├── userService.js           # User management logic
│   ├── moderationService.js     # Content moderation
│   └── notificationService.js   # Notifications (future)
│
├── repositories/
│   ├── eventRepository.js       # Event database operations
│   ├── userRepository.js        # User database operations
│   ├── messageRepository.js     # Message database operations
│   └── attendeeRepository.js    # Attendee database operations
│
├── utils/
│   ├── validators.js            # Custom validation helpers
│   ├── helpers.js               # General utility functions
│   └── constants.js             # App-wide constants
│
├── .env                         # Environment variables
├── server.js                    # Server entry point
└── package.json                 # Dependencies
```

---

## 🔄 Request Flow Example

### Creating an Event

```
1. User submits "Create Event" form from React frontend
   ↓
2. POST /api/events
   ↓
3. Authentication Middleware
   • Verifies Supabase JWT token
   • Extracts user ID from token
   ↓
4. Validation Middleware
   • Checks event data (title, date, location, etc.)
   • Ensures required fields are present
   ↓
5. Event Controller (createEvent)
   • Receives validated request
   • Calls eventService.createEvent(userId, eventData)
   ↓
6. Event Service
   • Business logic checks:
     - Is the event date in the future?
     - Is the title appropriate?
   • Calls eventRepository.create(eventData)
   ↓
7. Event Repository
   • Executes Supabase query:
     INSERT INTO events (title, date, creator_id, ...)
   • Returns new event object
   ↓
8. Service returns processed event
   ↓
9. Controller formats response
   ↓
10. Response sent back to React frontend
    { success: true, event: {...} }
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

### Events API

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/events` | Get all events | No |
| `GET` | `/api/events/:id` | Get specific event | No |
| `POST` | `/api/events` | Create new event | Yes |
| `PUT` | `/api/events/:id` | Update event | Yes (owner) |
| `DELETE` | `/api/events/:id` | Delete event | Yes (owner) |
| `POST` | `/api/events/:id/join` | Join an event | Yes |
| `POST` | `/api/events/:id/leave` | Leave an event | Yes |
| `GET` | `/api/events/:id/attendees` | Get attendee list | No |

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
- `username` (string, unique)
- `profile_picture_url` (string)
- `bio` (text)
- `created_at` (timestamp)

**events**
- `id` (UUID, primary key)
- `creator_id` (UUID, foreign key → users)
- `title` (string)
- `description` (text)
- `event_date` (timestamp)
- `location` (string)
- `max_attendees` (integer)
- `image_url` (string)
- `created_at` (timestamp)

**attendees**
- `id` (UUID, primary key)
- `event_id` (UUID, foreign key → events)
- `user_id` (UUID, foreign key → users)
- `joined_at` (timestamp)
- Unique constraint: (event_id, user_id)

**messages**
- `id` (UUID, primary key)
- `event_id` (UUID, foreign key → events)
- `sender_id` (UUID, foreign key → users)
- `content` (text)
- `created_at` (timestamp)
- `edited_at` (timestamp, nullable)

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

1. **Create route** → Define endpoint in routes folder
2. **Add middleware** → Apply auth, validation as needed
3. **Build controller** → Handle request/response
4. **Write service** → Implement business logic
5. **Create repository** → Define database operations
6. **Test endpoint** → Use Postman/Insomnia
7. **Document** → Update API docs

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [REST API Best Practices](https://restfulapi.net/)
- [Node.js Security Checklist](https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html)

---

**Questions or suggestions?** Reach out to Jose or Jorge (co-leads)! 🚀
