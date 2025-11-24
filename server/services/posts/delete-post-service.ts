import { supabaseAdmin } from '../../config/supabase';

export interface DeletePostResponse {
    success: boolean;
    message: string;
}
export async function deletePostService(postId: string): Promise<DeletePostResponse> {
    try {
        const { error } = await supabaseAdmin
            .from('posts')
            .delete()
            .eq('id', postId);

        if (error) {
            throw new Error(`Error deleting post: ${error.message}`);
        }

        return {
            success: true,
            message: 'Post deleted successfully',
        }
    } catch (error) {
        console.error('Error in deletePost:', error);
        throw error;
    }
}