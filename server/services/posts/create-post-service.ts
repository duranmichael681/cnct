import { supabaseAdmin } from '../../config/supabase';

export interface postData {
    title: string;
    body: string;
    userId: string;
    building?: string;
    start_date?: string;
    end_date?: string;
    postPictureUrl?: string;
    isPrivate?: boolean;
}

export interface postResponse {
    success: boolean;
    message: string;
    id: string;         // id is uuid, not number
    title: string;
    body: string;       // was content
    created_at: string;
}
export async function createPostService(postData: postData): Promise<postResponse> {
    try {
        // Map camelCase fields to snake_case database columns
        const { data, error } = await supabaseAdmin
            .from('posts')
            .insert([{
                title: postData.title,
                body: postData.body,
                organizer_id: postData.userId,
                building: postData.building,
                start_date: postData.start_date,
                end_date: postData.end_date,
                post_picture_url: postData.postPictureUrl,
                is_private: postData.isPrivate ?? false
            }])
            .select()
            .single();

        if (error) {
            throw new Error(`Error inserting post: ${error.message}`);
        }

        if (!data) {
            throw new Error('No data returned after insert');
        }

        const response: postResponse = {
            success: true,
            message: 'Post created successfully',
            id: data.id,
            title: data.title,
            body: data.body,       // was content
            created_at: data.created_at,
        }

        return response;

    } catch (error) {
        console.error('Error in createPost:', error);
        throw error;
    }
}