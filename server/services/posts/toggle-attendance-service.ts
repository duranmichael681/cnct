import { supabaseAdmin } from '../../config/supabase.ts';

export interface ToggleAttendanceResult {
    action: 'joined' | 'left';
    data: any;
}

/**
 * Toggle attendance for a post
 * @param postId - The post ID to attend/unattend
 * @param userId - The user ID toggling attendance
 * @returns Object indicating whether user joined or left, and the attendee data
 */
export async function toggleAttendanceService(
    postId: string, 
    userId: string
): Promise<ToggleAttendanceResult> {
    // Check if user is already attending
    const { data: existing } = await supabaseAdmin
        .from('attendees')
        .select('id')
        .eq('posts_id', postId)
        .eq('user_id', userId)
        .single();

    if (existing) {
        // User is attending - remove them
        const { error } = await supabaseAdmin
            .from('attendees')
            .delete()
            .eq('posts_id', postId)
            .eq('user_id', userId);

        if (error) throw error;

        console.log('✅ User removed from post attendance:', { postId, userId });
        return { action: 'left', data: null };
    } else {
        // User is not attending - add them
        const { data, error } = await supabaseAdmin
            .from('attendees')
            .insert([{ posts_id: postId, user_id: userId }])
            .select()
            .single();

        if (error) throw error;

        console.log('✅ User added to post attendance:', { postId, userId });
        return { action: 'joined', data };
    }
}
