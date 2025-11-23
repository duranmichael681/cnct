import { deletePostService } from "../../services/posts/delete-post-service";
import { Request, Response } from 'express';

export async function deletePostController(req: Request, res: Response) {
    try {
        var eventId = req.params.id;
        const response = await deletePostService(eventId);
        res.send(response);
        return response;
    } catch (error) {
        console.error('Error in deletePostController:', error);
        res.send('Error in deletePostController:' + error)
        throw error;
    }
}
