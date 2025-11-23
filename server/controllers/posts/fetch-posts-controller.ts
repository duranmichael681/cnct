import { fetchPostService } from "../../services/posts/fetch-posts-service";
import { Request, Response } from "express";


export async function fetchPostsController(req: Request, res: Response) {
    try {
        const events = await fetchPostService();
        res.send(events);
        return events;
    } catch (error) {
        console.error('Error in fetchPostsController:', error);
        res.send('Error in fetchPostsController:' + error);
        throw error;
    }
}