import { updatePostService } from '../../services/posts/update-post-service';
import { Post } from '../../services/posts/fetch-post-by-id-service';
import { Request, Response } from 'express';
import { moderateImage } from '../../middleware/moderate';
import { supabaseAdmin } from '../../config/supabase.js';

export async function updatePostController(req: Request, res: Response) {
    try {
        const postId = req.params.id;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated. Please log in to update a post.'
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
                error: 'You do not have permission to update this post.'
            });
        }

        const postData: Partial<Post> = {
            id: postId,
            title: req.body.title,
            body: req.body.body,
            organizer_id: req.body.organizer_id,
            building: req.body.building,
            startDate: req.body.start_date,
            endDate: req.body.end_date,
            postPictureUrl: req.body.post_picture_url,
            createdAt: req.body.created_at,
            isPrivate: req.body.is_private,
            rsvp: req.body.rsvp
        }

        if (postData.postPictureUrl) {
            console.log('🔍 Moderating image:', postData.postPictureUrl);
            const isModerationPassed = await moderateImage(postData.postPictureUrl);
            if (!isModerationPassed) {
                console.log('❌ Image failed moderation check');
                return res.status(400).json({
                    success: false,
                    error: 'MODERATION_FAILED: Image contains inappropriate content and was flagged by our moderation system. Please upload a different image.'
                });
            }
            console.log('✅ Image passed moderation');
        }

        const updatedPost = await updatePostService(postId, postData);
        
        console.log('✅ Post updated successfully:', postId);
        res.json({ success: true, data: updatedPost });
    } catch (error) {
        console.error('❌ Error updating post:', error);
        res.status(500).json({ success: false, error: String(error) });
    }
}