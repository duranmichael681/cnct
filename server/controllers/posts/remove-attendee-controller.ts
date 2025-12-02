import { removeAttendeeService, RemoveAttendeeResponse} from "../../services/posts/remove-attendee-service";
import { Request, Response } from "express";

export async function removeAttendeeController(req: Request, res: Response) {
    try {
        const postId = req.params.id;
        const userId = req.params.userId;
        const response = await removeAttendeeService(Number(postId), Number(userId));
        res.json({ success: true, data: response });
    } catch (error) {
        console.error('Error in removeAttendeeController:', error);
        res.status(500).json({ success: false, error: String(error) });
    }
}
