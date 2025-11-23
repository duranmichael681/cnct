import { supabase } from '../../server';

export interface Attendee{
    id: number;
    post_id: number;
    user_id: number;
    created_at: string;
}

export async function fetchAttendeesService(eventId: string): Promise<Attendee[]> {
    try {
        const { data, error } = await supabase
            .from('attendees')
            .select('*')
            .eq('event_id', eventId);

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