import { deletePostService } from "../../services/posts/delete-post-service";
import { Request, Response } from 'express';

export async function deletePostController(req: Request, res: Response) {
    try {
        const eventId = req.params.id;
        const response = await deletePostService(eventId);
        res.json({ success: true, data: response });
    } catch (error) {
        console.error('Error in deletePostController:', error);
        res.status(500).json({ success: false, error: String(error) });
    }
}
