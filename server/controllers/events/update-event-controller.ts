import { updateEventService } from '../../services/events/update-event-service';
import { Event } from '../../services/events/fetch-event-by-id-service';

export async function updateEventController(eventId: string, eventData: Partial<Event>): Promise<Event> {
    try {
        const updatedEvent = await updateEventService(eventId, eventData);
        return updatedEvent
    } catch (error) {
        console.error('Error in updateEventController:', error);
        throw error;
    }
}