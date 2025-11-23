import { fetchPostByIdService } from "../../services/posts/fetch-post-by-id-service";
import { Request, Response } from "express";

export async function fetchPostByIdController(req: Request, res: Response) {
    try {
        var eventId = req.params.id;
        const post = await fetchPostByIdService(eventId);
        res.send(post);
        return post;
    } catch (error) {
        console.error('Error in fetchEventByIdController:', error);
        res.send('Error in fetchEventByIdController:' + error)
        throw error;
    }
}