import { supabaseAdmin } from '../../config/supabase.ts';
import type { Comment } from './fetch-comments-service.js';

/**
 * Create a new comment on a post
 * @param postId - The post ID to comment on
 * @param userId - The user ID creating the comment
 * @param text - The comment text content
 * @returns The created comment with user information
 */
export async function createCommentService(
    postId: string,
    userId: string,
    text: string
): Promise<Comment> {
    const { data: comment, error } = await supabaseAdmin
        .from('comments')
        .insert({
            post_id: postId,
            user_id: userId,
            text
        })
        .select(`
            *,
            users!fk_comments_user (
                id,
                first_name,
                last_name,
                profile_picture_url
            )
        `)
        .single();

    if (error) {
        throw new Error(`Error creating comment: ${error.message}`);
    }

    console.log(`✅ Comment created successfully:`, { commentId: comment.id, postId, userId });
    return comment as Comment;
}
