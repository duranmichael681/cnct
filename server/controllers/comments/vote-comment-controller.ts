import type { Request, Response } from 'express';
import { voteCommentService } from '../../services/comments/vote-comment-service.ts';

/**
 * POST /api/comments/:commentId/vote
 * Upvote or downvote a comment using upsert pattern
 * 
 * This endpoint trusts the client state. If the client shows they haven't voted
 * and they send an upvote, we upvote. This prevents race conditions where the
 * user's visible state differs from the database state.
 * 
 * Body: { vote_type: 'up' | 'down' | null }
 *   - 'up' or 'down': Set/change vote to that type
 *   - null: Remove vote (if exists)
 */
export async function voteCommentController(req: Request, res: Response) {
    try {
        const { commentId } = req.params;
        const { vote_type } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ 
                success: false, 
                error: 'User not authenticated' 
            });
        }

        if (vote_type !== null && !['up', 'down'].includes(vote_type)) {
            return res.status(400).json({ 
                success: false, 
                error: 'vote_type must be "up", "down", or null' 
            });
        }

        const updatedComment = await voteCommentService(commentId, userId, vote_type);

        res.json({ success: true, data: updatedComment });
    } catch (error) {
        console.error('❌ Error voting on comment:', error);
        res.status(500).json({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
        });
    }
}
