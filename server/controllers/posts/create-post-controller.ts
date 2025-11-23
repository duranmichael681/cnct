import { createPostService, postData, postResponse } from '../../services/posts/create-post-service';

export async function createPostController(postData: postData): Promise<postResponse> {
    try {
        const response = await createPostService(postData);
        return response;
    } catch (error) {
        console.error('Error in createEventController:', error);
        throw error;
    }
}