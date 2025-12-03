import type { Request, Response } from 'express';
import { fetchCommentsService } from '../../services/comments/fetch-comments-service.js';

/**
 * GET /api/comments/post/:postId
 * Get all comments for a specific post
 */
export async function fetchCommentsController(req: Request, res: Response) {
    try {
        const { postId } = req.params;

        const comments = await fetchCommentsService(postId);

        res.json({ success: true, data: comments });
    } catch (error) {
        console.error('❌ Error fetching comments:', error);
        res.status(500).json({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
        });
    }
}
