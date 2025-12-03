import { supabaseAdmin } from '../../config/supabase.ts';

export interface Comment {
    id: string;
    post_id: string;
    user_id: string;
    text: string;
    upvotes: number;
    downvotes: number;
    created_at: string;
    updated_at: string;
    users?: {
        id: string;
        first_name: string | null;
        last_name: string | null;
        profile_picture_url: string | null;
    };
}

/**
 * Fetch all comments for a specific post
 * @param postId - The post ID to fetch comments for
 * @returns Array of comments with user information
 */
export async function fetchCommentsService(postId: string): Promise<Comment[]> {
    const { data, error } = await supabaseAdmin
        .from('comments')
        .select(`
            *,
            users!fk_comments_user (
                id,
                first_name,
                last_name,
                profile_picture_url
            )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(`Error fetching comments: ${error.message}`);
    }

    console.log(`✅ Fetched ${data?.length || 0} comments for post ${postId}`);
    return data as Comment[];
}
