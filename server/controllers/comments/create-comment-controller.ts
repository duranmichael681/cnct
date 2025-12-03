import type { Request, Response } from 'express';
import { createCommentService } from '../../services/comments/create-comment-service.ts';

/**
 * POST /api/comments
 * Create a new comment on a post
 */
export async function createCommentController(req: Request, res: Response) {
    try {
        const { post_id, text } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ 
                success: false, 
                error: 'User not authenticated' 
            });
        }

        if (!text || !text.trim()) {
            return res.status(400).json({ 
                success: false, 
                error: 'Comment text is required' 
            });
        }

        if (text.length > 500) {
            return res.status(400).json({ 
                success: false, 
                error: 'Comment must be 500 characters or less' 
            });
        }

        const comment = await createCommentService(post_id, userId, text.trim());

        res.json({ success: true, data: comment });
    } catch (error) {
        console.error('❌ Error creating comment:', error);
        res.status(500).json({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
        });
    }
}
