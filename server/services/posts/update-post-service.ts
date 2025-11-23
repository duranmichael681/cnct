import { supabaseAdmin } from '../../config/supabase'
import { Post } from './fetch-post-by-id-service';

export async function updatePostService(eventId: string, updatedData: Partial<Post>): Promise<Post> {
    try {
        const { data, error } = await supabaseAdmin
            .from('posts')
            .update({
                title: updatedData.title,
                body: updatedData.body,
                organizer_id: updatedData.organizerId,
                building: updatedData.building,
                start_date: updatedData.startDate,
                end_date: updatedData.endDate,
                post_picture_url: updatedData.postPictureUrl,
                is_private: updatedData.isPrivate,
                rsvp: updatedData.rsvp
            })
            .eq('id', eventId)
            .single();
        
        if (error) {
            throw new Error(`Error updating event: ${error.message}`);
        }
        if (!data) {
            throw new Error('No data returned from update');
        }
        
        const updatedEvent: Post = {
            id: data.id,
            title: data.title,
            body: data.body,
            organizerId: data.organizer_id,
            building: data.building,
            startDate: data.start_date,
            endDate: data.end_date,
            postPictureUrl: data.post_picture_url,
            createdAt: data.created_at,
            isPrivate: data.is_private,
            rsvp: data.rsvp
        };
        
        return updatedEvent;
    } catch (error) {
        console.error('Error in updateEvent:', error);
        throw error;
    }
}