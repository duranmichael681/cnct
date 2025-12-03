import { supabaseAdmin } from '../../config/supabase.ts';

/**
 * Delete a comment (only if user is the author)
 * @param commentId - The comment ID to delete
 * @param userId - The user ID attempting to delete
 * @throws Error if comment not found or user is not the author
 */
export async function deleteCommentService(
    commentId: string,
    userId: string
): Promise<void> {
    // Check if user is the author
    const { data: comment, error: fetchError } = await supabaseAdmin
        .from('comments')
        .select('user_id')
        .eq('id', commentId)
        .single();

    if (fetchError || !comment) {
        throw new Error('Comment not found');
    }

    if (comment.user_id !== userId) {
        throw new Error('You can only delete your own comments');
    }

    // Delete the comment (CASCADE will handle comment_votes)
    const { error: deleteError } = await supabaseAdmin
        .from('comments')
        .delete()
        .eq('id', commentId);

    if (deleteError) {
        throw new Error(`Error deleting comment: ${deleteError.message}`);
    }

    console.log(`✅ Comment deleted successfully:`, { commentId, userId });
}
