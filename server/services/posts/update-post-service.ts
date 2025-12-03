import { supabaseAdmin } from '../../config/supabase';
import { Post } from './fetch-post-by-id-service';

export async function updatePostService(postId: string, updatedData: Partial<Post>): Promise<Post> {
    try {
        const { data, error } = await supabaseAdmin
            .from('posts')
            .update({
                title: updatedData.title,
                body: updatedData.body,
                organizer_id: updatedData.organizer_id,
                building: updatedData.building,
                start_date: updatedData.startDate,
                end_date: updatedData.endDate,
                post_picture_url: updatedData.postPictureUrl,
                is_private: updatedData.isPrivate,
                rsvp: updatedData.rsvp
            })
            .eq('id', postId)
            .single();

        if (error) {
            throw new Error(`Error updating post: ${error.message}`);
        }
        if (!data) {
            throw new Error('No data returned from update');
        }
        
        const updatedPost: Post = {
            id: data.id,
            title: data.title,
            body: data.body,
            organizer_id: data.organizer_id,
            building: data.building,
            startDate: data.start_date,
            endDate: data.end_date,
            postPictureUrl: data.post_picture_url,
            createdAt: data.created_at,
            isPrivate: data.is_private,
            rsvp: data.rsvp
        };
        
        return updatedPost;
    } catch (error) {
        console.error('Error in updatePost:', error);
        throw error;
    }
}