import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { CommentControllerModule } from '../controllers/comment-controller-module.js';

const router = express.Router();

/**
 * GET /api/comments/post/:postId
 * Get all comments for a specific post
 */
router.get('/post/:postId', CommentControllerModule.fetchCommentsController);

/**
 * POST /api/comments
 * Create a new comment on a post
 */
router.post('/', authMiddleware, CommentControllerModule.createCommentController);

/**
 * DELETE /api/comments/:commentId
 * Delete a comment (only by the author)
 */
router.delete('/:commentId', authMiddleware, CommentControllerModule.deleteCommentController);

/**
 * POST /api/comments/:commentId/vote
 * Upvote or downvote a comment using upsert pattern
 */
router.post('/:commentId/vote', authMiddleware, CommentControllerModule.voteCommentController);

export default router;
