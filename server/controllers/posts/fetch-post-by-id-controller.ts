import { fetchPostByIdService } from "../../services/posts/fetch-post-by-id-service";

export async function fetchPostByIdController(eventId: string) {
    try {
        const post = await fetchPostByIdService(eventId);
        return post;
    } catch (error) {
        console.error('Error in fetchEventByIdController:', error);
        throw error;
    }
}