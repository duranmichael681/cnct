import { fetchAttendeesService, Attendee } from '../../services/posts/fetch-attendees-service.js';

export async function fetchAttendeesController(eventId: string): Promise<Attendee[]> {
    try {
        const attendees = await fetchAttendeesService(eventId);
        return attendees;
    }
    catch (error) {
        console.error('Error in fetchAttendeesController:', error);
        throw error;
    }
}