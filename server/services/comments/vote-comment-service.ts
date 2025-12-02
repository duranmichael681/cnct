import { supabaseAdmin } from '../../config/supabase.ts';

export interface UpdatedComment {
    upvotes: number;
    downvotes: number;
}

/**
 * Vote on a comment (upvote/downvote/remove vote) using upsert pattern
 * @param commentId - The comment ID to vote on
 * @param userId - The user ID voting
 * @param voteType - 'up', 'down', or null to remove vote
 * @returns Updated comment vote counts
 */
export async function voteCommentService(
    commentId: string,
    userId: string,
    voteType: 'up' | 'down' | null
): Promise<UpdatedComment> {
    // Get current vote state from database
    const { data: existingVote } = await supabaseAdmin
        .from('comment_votes')
        .select('vote_type')
        .eq('comment_id', commentId)
        .eq('user_id', userId)
        .maybeSingle();

    // If removing vote (voteType === null)
    if (voteType === null) {
        if (existingVote) {
            // Delete the vote
            await supabaseAdmin
                .from('comment_votes')
                .delete()
                .eq('comment_id', commentId)
                .eq('user_id', userId);

            // Decrement the appropriate counter
            const field = existingVote.vote_type === 'up' ? 'upvotes' : 'downvotes';
            const { data: comment } = await supabaseAdmin
                .from('comments')
                .select('upvotes, downvotes')
                .eq('id', commentId)
                .single();

            if (comment) {
                const currentValue = existingVote.vote_type === 'up' ? comment.upvotes : comment.downvotes;
                await supabaseAdmin
                    .from('comments')
                    .update({ [field]: Math.max(0, currentValue - 1) })
                    .eq('id', commentId);
            }
        }
        // If no existing vote and client wants to remove, no action needed
    } else {
        // Setting or changing a vote - use upsert to handle both cases
        await supabaseAdmin
            .from('comment_votes')
            .upsert({
                comment_id: commentId,
                user_id: userId,
                vote_type: voteType
            }, {
                onConflict: 'comment_id,user_id'
            });

        // Update vote counters based on what changed
        if (existingVote) {
            if (existingVote.vote_type !== voteType) {
                // Changed from up to down or vice versa
                const oldField = existingVote.vote_type === 'up' ? 'upvotes' : 'downvotes';
                const newField = voteType === 'up' ? 'upvotes' : 'downvotes';
                
                const { data: comment } = await supabaseAdmin
                    .from('comments')
                    .select('upvotes, downvotes')
                    .eq('id', commentId)
                    .single();

                if (comment) {
                    await supabaseAdmin
                        .from('comments')
                        .update({
                            [oldField]: Math.max(0, comment[oldField] - 1),
                            [newField]: comment[newField] + 1
                        })
                        .eq('id', commentId);
                }
            }
            // If same vote type, no counter change needed
        } else {
            // New vote - increment counter
            const field = voteType === 'up' ? 'upvotes' : 'downvotes';
            const { data: comment } = await supabaseAdmin
                .from('comments')
                .select('upvotes, downvotes')
                .eq('id', commentId)
                .single();

            if (comment) {
                const currentValue = voteType === 'up' ? comment.upvotes : comment.downvotes;
                await supabaseAdmin
                    .from('comments')
                    .update({ [field]: currentValue + 1 })
                    .eq('id', commentId);
            }
        }
    }

    // Fetch updated comment vote counts
    const { data: updatedComment } = await supabaseAdmin
        .from('comments')
        .select('upvotes, downvotes')
        .eq('id', commentId)
        .single();

    console.log(`✅ Vote updated for comment ${commentId}:`, { voteType, upvotes: updatedComment?.upvotes, downvotes: updatedComment?.downvotes });
    return updatedComment as UpdatedComment;
}
