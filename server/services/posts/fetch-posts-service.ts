import { supabaseAdmin } from '../../config/supabase';
import { Post } from './fetch-post-by-id-service';

export async function fetchPostService(): Promise<Post[]> {
    try {
        const { data, error } = await supabaseAdmin
            .from('posts')
            .select('*');
            
        if (error) {
            throw new Error(`Error fetching events: ${error.message}`);
        }
        if (!data) {
            throw new Error('No data returned from fetch');
        }
        
        const events: Post[] = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            body: item.body,
            organizerId: item.organizer_id,
            building: item.building,
            startDate: item.start_date,
            endDate: item.end_date,
            postPictureUrl: item.post_picture_url,
            createdAt: item.created_at,
            isPrivate: item.is_private,
            rsvp: item.rsvp
        }));
        
        return events;
    } catch (error) {
        console.error('Error in fetchEvents:', error);
        throw error;
    }
}