import { fetchEventByIdService } from "../../services/events/fetch-event-by-id-service";

export async function fetchEventByIdController(eventId: string) {
    try {
        const post = await fetchEventByIdService(eventId);
        return post;
    } catch (error) {
        console.error('Error in fetchEventByIdController:', error);
        throw error;
    }
}