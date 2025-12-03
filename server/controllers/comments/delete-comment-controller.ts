import type { Request, Response } from 'express';
import { deleteCommentService } from '../../services/comments/delete-comment-service.ts';

/**
 * DELETE /api/comments/:commentId
 * Delete a comment (only by the author)
 */
export async function deleteCommentController(req: Request, res: Response) {
    try {
        const { commentId } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ 
                success: false, 
                error: 'User not authenticated' 
            });
        }

        await deleteCommentService(commentId, userId);

        res.json({ success: true, message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('❌ Error deleting comment:', error);
        
        if (error instanceof Error) {
            if (error.message === 'Comment not found') {
                return res.status(404).json({ success: false, error: error.message });
            }
            if (error.message === 'You can only delete your own comments') {
                return res.status(403).json({ success: false, error: error.message });
            }
        }
        
        res.status(500).json({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
        });
    }
}
