import { deletePostService } from "../../services/events/delete-post-service";

export async function deletePostController(eventId: string) {
    try {
        const response = await deletePostService(eventId);
        return response;
    } catch (error) {
        console.error('Error in deletePostController:', error);
        throw error;
    }
}
