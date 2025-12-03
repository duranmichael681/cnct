import { supabaseAdmin } from '../../config/supabase';

export interface RemoveAttendeeResponse {
    success: boolean;
    message: string;
}

export async function removeAttendeeService(postId: number, userId: number): Promise<RemoveAttendeeResponse> {
    try {
        const { data, error } = await supabaseAdmin
            .from('attendees')
            .delete()
            .eq('posts_id', postId)
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