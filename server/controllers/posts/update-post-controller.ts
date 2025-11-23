import { updatePostService } from '../../services/posts/update-post-service';
import { Post } from '../../services/posts/fetch-post-by-id-service';

export async function updatePostController(eventId: string, eventData: Partial<Post>): Promise<Post> {
    try {
        const updatedEvent = await updatePostService(eventId, eventData);
        return updatedEvent
    } catch (error) {
        console.error('Error in updateEventController:', error);
        throw error;
    }
}