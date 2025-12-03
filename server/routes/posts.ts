import { Request, Response, Router } from 'express';
import { PostControllerModule } from '../controllers/controller-module.js';
import { authMiddleware } from '../middleware/auth.js';

const postsRouter = Router();

// GET /api/posts - Fetch all posts (optionally filtered by user tag preferences)
// Query params: ?userId=xxx to filter by user preferences
postsRouter.get('/', PostControllerModule.fetchPostsController)

// GET /api/posts/:id - Fetch a single post by ID
postsRouter.get('/:id', PostControllerModule.fetchPostByIdController)

// POST /api/posts - Create a new post (requires authentication)
postsRouter.post('/', authMiddleware, PostControllerModule.createPostController)

// PUT /api/posts/:id - Update a post (requires authentication, only organizer can update)
postsRouter.put('/:id', authMiddleware, PostControllerModule.updatePostController)

// DELETE /api/posts/:id - Delete a post (requires authentication, only organizer can delete)
postsRouter.delete('/:id', authMiddleware, PostControllerModule.deletePostController)

// POST /api/posts/:id/toggle-attendance - Toggle attendance for a post (requires authentication)
postsRouter.post('/:id/toggle-attendance', authMiddleware, PostControllerModule.toggleAttendanceController)

// POST /api/posts/:id/leave - Remove attendance from a post (requires authentication)
postsRouter.post('/:id/leave', authMiddleware, PostControllerModule.removeAttendeeController)

// GET /api/posts/:id/attendees - Get all attendees for a specific post
postsRouter.get('/:id/attendees', PostControllerModule.fetchPostAttendeesController)

export default postsRouter

