import { supabase } from '../../server';

export interface postData {
    title: string;
    content: string;
    userId: string;
    building: string;
    postPictureUrl?: string;
    isPrivate?: boolean;
}

export interface postResponse{
    success: boolean;
    message: string;
    id: number;
    title: string;
    content: string;
    created_at: string;
}
export async function createPostService(postData: postData): Promise<postResponse> {
    try {

        const { data, error } = await supabase
            .from('posts')
            .insert([postData])
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
            content: data.content,
            created_at: data.created_at,
        }

        return response;

    } catch (error) {
        console.error('Error in createPost:', error);
        throw error;
    }
}