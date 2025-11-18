# Backend - Validation & Error Handling

## What's Missing
No input validation, inconsistent errors, no logging, missing security headers.

## Tasks

### 1. Install Packages
```bash
npm install joi helmet express-rate-limit winston
```

### 2. Create Validation Schemas (`server/validators/schemas.js`)
- [ ] Post creation (title, description, location, date, max_attendees)
- [ ] User updates (name, bio, profile_picture)
- [ ] Comments (content, post_id)
- [ ] Attendance (action: join/leave)

### 3. Create Validation Middleware (`server/middleware/validation.js`)
- [ ] Generic validator that checks schemas
- [ ] Returns 400 with field-specific errors

### 4. Add Input Sanitization (`server/utils/sanitize.js`)
- [ ] Remove HTML/script tags from text
- [ ] Validate URLs

### 5. Setup Logging (`server/utils/logger.js`)
- [ ] Use Winston for structured logs
- [ ] Log errors to file
- [ ] Log requests/responses

### 6. Create Error Handler (`server/middleware/errorHandler.js`)
- [ ] Catch all errors
- [ ] Log with details
- [ ] Return consistent error format

### 7. Add Validation to Routes
- [ ] `POST /api/posts` - validate post creation data
- [ ] `PUT /api/posts/:id` - validate post updates
- [ ] `POST /api/posts/:id/attend` - validate attendance action
- [ ] `PUT /api/users/:id` - validate user data
- [ ] `POST /api/storage` - validate file size/type

### 8. Update Server (`server/server.js`)
- [ ] Add helmet for security headers
- [ ] Add rate limiting (100 req/15min)
- [ ] Set request size limit (10mb)
- [ ] Add error handler middleware

## Must Work
- [ ] Invalid data returns 400 with clear errors
- [ ] XSS attempts are blocked
- [ ] Files over 5MB are rejected
- [ ] All errors are logged
- [ ] Rate limiting prevents spam
- [ ] Security headers are set

## Example Validation
```javascript
// In routes
router.post('/', authMiddleware, validate(createPostSchema), async (req, res) => {
  // Data is already validated and sanitized
});
```

**Priority:** MEDIUM-HIGH | **Time:** 10-15 hours
