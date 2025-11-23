import { supabaseAdmin } from '../../config/supabase';

export interface Post {
    id: string;
    title: string;
    body: string;
    organizerId: string;
    building: string | null
    startDate: string;
    endDate: string;
    postPictureUrl: string | null;
    createdAt: string;
    isPrivate: boolean
    rsvp: number;
}

export async function fetchPostByIdService(eventId: string): Promise<Post> {
    try {
        const { data, error } = await supabaseAdmin
            .from('posts')
            .select('*')
            .eq('id', eventId)
            .single();
            
        if (error) {
            throw new Error(`Error fetching post: ${error.message}`);
        }
        if (!data) {
            throw new Error('No data returned from fetch');
        }
        
        const event: Post = {
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
        
        return event;
    } catch (error) {
        console.error('Error in fetchPostById:', error);
        throw error;
    }
}

