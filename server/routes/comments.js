import express from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/comments/post/:postId
 * Get all comments for a specific post
 */
router.get('/post/:postId', async (req, res) => {
    try {
        const { postId } = req.params;

        const { data, error } = await supabaseAdmin
            .from('comments')
            .select(`
                *,
                users (
                    id,
                    first_name,
                    last_name,
                    profile_picture_url
                )
            `)
            .eq('post_id', postId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/comments
 * Create a new comment on a post
 */
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { post_id, text } = req.body;
        const userId = req.user.id;

        if (!text || !text.trim()) {
            return res.status(400).json({ success: false, error: 'Comment text is required' });
        }

        if (text.length > 500) {
            return res.status(400).json({ success: false, error: 'Comment must be 500 characters or less' });
        }

        const { data: comment, error } = await supabaseAdmin
            .from('comments')
            .insert({
                post_id,
                user_id: userId,
                text: text.trim()
            })
            .select(`
                *,
                users (
                    id,
                    first_name,
                    last_name,
                    profile_picture_url
                )
            `)
            .single();

        if (error) throw error;

        res.json({ success: true, data: comment });
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * DELETE /api/comments/:commentId
 * Delete a comment (only by the author)
 */
router.delete('/:commentId', authMiddleware, async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user.id;

        // Check if user is the author
        const { data: comment, error: fetchError } = await supabaseAdmin
            .from('comments')
            .select('user_id')
            .eq('id', commentId)
            .single();

        if (fetchError || !comment) {
            return res.status(404).json({ success: false, error: 'Comment not found' });
        }

        if (comment.user_id !== userId) {
            return res.status(403).json({ success: false, error: 'You can only delete your own comments' });
        }

        const { error: deleteError } = await supabaseAdmin
            .from('comments')
            .delete()
            .eq('id', commentId);

        if (deleteError) throw deleteError;

        res.json({ success: true, message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/comments/:commentId/vote
 * Upvote or downvote a comment
 */
router.post('/:commentId/vote', authMiddleware, async (req, res) => {
    try {
        const { commentId } = req.params;
        const { vote_type } = req.body; // 'up' or 'down'
        const userId = req.user.id;

        if (!['up', 'down'].includes(vote_type)) {
            return res.status(400).json({ success: false, error: 'vote_type must be "up" or "down"' });
        }

        // Check if user already voted
        const { data: existingVote } = await supabaseAdmin
            .from('comment_votes')
            .select('vote_type')
            .eq('comment_id', commentId)
            .eq('user_id', userId)
            .single();

        if (existingVote) {
            // If same vote type, remove the vote
            if (existingVote.vote_type === vote_type) {
                await supabaseAdmin
                    .from('comment_votes')
                    .delete()
                    .eq('comment_id', commentId)
                    .eq('user_id', userId);

                // Decrement the count
                const field = vote_type === 'up' ? 'upvotes' : 'downvotes';
                await supabaseAdmin.rpc('decrement_comment_vote', { 
                    comment_id: commentId,
                    vote_field: field
                });
            } else {
                // Change vote type
                await supabaseAdmin
                    .from('comment_votes')
                    .update({ vote_type })
                    .eq('comment_id', commentId)
                    .eq('user_id', userId);

                // Increment new vote, decrement old vote
                const oldField = existingVote.vote_type === 'up' ? 'upvotes' : 'downvotes';
                const newField = vote_type === 'up' ? 'upvotes' : 'downvotes';
                
                await supabaseAdmin.rpc('decrement_comment_vote', { 
                    comment_id: commentId,
                    vote_field: oldField
                });
                await supabaseAdmin.rpc('increment_comment_vote', { 
                    comment_id: commentId,
                    vote_field: newField
                });
            }
        } else {
            // New vote
            await supabaseAdmin
                .from('comment_votes')
                .insert({
                    comment_id: commentId,
                    user_id: userId,
                    vote_type
                });

            // Increment the count
            const field = vote_type === 'up' ? 'upvotes' : 'downvotes';
            await supabaseAdmin.rpc('increment_comment_vote', { 
                comment_id: commentId,
                vote_field: field
            });
        }

        // Fetch updated comment
        const { data: updatedComment } = await supabaseAdmin
            .from('comments')
            .select('upvotes, downvotes')
            .eq('id', commentId)
            .single();

        res.json({ success: true, data: updatedComment });
    } catch (error) {
        console.error('Error voting on comment:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
