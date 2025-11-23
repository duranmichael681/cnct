import { removeAttendeeService, RemoveAttendeeResponse} from "../../services/posts/remove-attendee-service";
import { Request, Response } from "express";

export async function removeAttendeeController(req: Request, res: Response): Promise<RemoveAttendeeResponse> {
    try {
        var eventId = req.params.id;
        var userId = req.query.userId;
        const response = await removeAttendeeService(Number(eventId), Number(userId));
        return response;
    } catch (error) {
        console.error('Error in removeAttendeeController:', error);
        res.send('Error in removeAttendeeController:' + error);
        throw error;
    }
}
