import { removeAttendeeService, RemoveAttendeeResponse} from "../../services/events/remove-attendee-service";

export async function removeAttendeeController(eventId: string, userId: string): Promise<RemoveAttendeeResponse> {
    try {
        const response = await removeAttendeeService(Number(eventId), Number(userId));
        return response;
    } catch (error) {
        console.error('Error in removeAttendeeController:', error);
        throw error;
    }
}
