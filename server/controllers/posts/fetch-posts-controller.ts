import { fetchPostService } from "../../services/posts/fetch-posts-service";
import { Request, Response } from "express";


export async function fetchPostsController(req: Request, res: Response) {
    try {
        const events = await fetchPostService();
        res.json({ success: true, data: events });
    } catch (error) {
        console.error('Error in fetchPostsController:', error);
        res.status(500).json({ success: false, error: String(error) });
    }
}