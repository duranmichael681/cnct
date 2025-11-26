import { fetchPostByIdService } from "../../services/posts/fetch-post-by-id-service";
import { Request, Response } from "express";

export async function fetchPostByIdController(req: Request, res: Response) {
    try {
        const eventId = req.params.id;
        const post = await fetchPostByIdService(eventId);
        res.json({ success: true, data: post });
    } catch (error) {
        console.error('Error in fetchPostByIdController:', error);
        res.status(500).json({ success: false, error: String(error) });
    }
}