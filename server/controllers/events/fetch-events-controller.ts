import { fetchPostService } from "../../services/events/fetch-events-service";

export async function fetchEventsController() {
    try {
        const events = await fetchPostService();
        return events;
    } catch (error) {
        console.error('Error in fetchEventsController:', error);
        throw error;
    }
}