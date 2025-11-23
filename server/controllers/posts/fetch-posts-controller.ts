import { fetchPostService } from "../../services/posts/fetch-posts-service";

export async function fetchPostsController() {
    try {
        const events = await fetchPostService();
        return events;
    } catch (error) {
        console.error('Error in fetchPostsController:', error);
        throw error;
    }
}