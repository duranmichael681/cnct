import { deletePostService } from "../../services/posts/delete-post-service";
import { Request, Response } from 'express';
import { supabaseAdmin } from '../../config/supabase.js';

export async function deletePostController(req: Request, res: Response) {
    try {
        const postId = req.params.id;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated. Please log in to delete a post.'
            });
        }

        // Check if post exists and user is the organizer
        const { data: post, error: fetchError } = await supabaseAdmin
            .from('posts')
            .select('organizer_id')
            .eq('id', postId)
            .single();

        if (fetchError || !post) {
            return res.status(404).json({
                success: false,
                error: 'Post not found.'
            });
        }

        if (post.organizer_id !== userId) {
            return res.status(403).json({
                success: false,
                error: 'You do not have permission to delete this post.'
            });
        }

        const response = await deletePostService(postId);
        
        console.log('✅ Post deleted successfully:', postId);
        res.json({ success: true, message: 'Post deleted successfully', data: response });
    } catch (error) {
        console.error('❌ Error deleting post:', error);
        res.status(500).json({ success: false, error: String(error) });
    }
}
