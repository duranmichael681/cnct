import { supabaseAdmin } from '../../config/supabase';

export interface Attendee {
    id: string;
    posts_id: string;
    user_id: string;
    created_at: string;
    users?: {
        id: string;
        username_email: string;
        first_name: string | null;
        last_name: string | null;
        profile_picture_url: string | null;
    };
}

export async function fetchAttendeesService(postId: string): Promise<Attendee[]> {
    try {
        const { data, error } = await supabaseAdmin
            .from('attendees')
            .select(`
                *,
                users(
                    id,
                    username_email,
                    first_name,
                    last_name,
                    profile_picture_url
                )
            `)
            .eq('posts_id', postId);

        if (error) {
            throw new Error(`Error fetching attendees: ${error.message}`);
        }

        if (!data) {
            throw new Error('No data returned from fetch');
        }

        return data as Attendee[];
    } catch (error) {
        console.error('Error in fetchAttendees:', error);
        throw error;
    }
}