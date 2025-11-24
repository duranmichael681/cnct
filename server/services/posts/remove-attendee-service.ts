import { supabaseAdmin } from '../../config/supabase';

export interface RemoveAttendeeResponse {
    success: boolean;
    message: string;
}

export async function removeAttendeeService(eventId: number, userId: number): Promise<RemoveAttendeeResponse> {
    try {
        const { error } = await supabaseAdmin
            .from('attendees')
            .delete()
            .eq('event_id', eventId)
            .eq('user_id', userId);

        if (error) {
            throw new Error(`Error removing attendee: ${error.message}`);
        }

        return {
            success: true,
            message: 'Attendee removed successfully',
        };
    } catch (error) {
        console.error('Error in removeAttendee:', error);
        throw error;
    }
}