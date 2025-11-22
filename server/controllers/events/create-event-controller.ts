import { createPostService, postData, postResponse } from '../../services/events/create-event-service';

export async function createEventController(postData: postData): Promise<postResponse> {
    try {
        const response = await createPostService(postData);
        return response;
    } catch (error) {
        console.error('Error in createEventController:', error);
        throw error;
    }
}