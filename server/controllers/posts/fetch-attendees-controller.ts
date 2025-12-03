import { fetchAttendeesService, Attendee } from '../../services/posts/fetch-attendees-service.js';
import { Request, Response } from 'express';

export async function fetchAttendeesController(req: Request, res: Response) {
    try {
        const postId = req.params.id;
        const attendees = await fetchAttendeesService(postId);
        res.json({ success: true, data: attendees });
    }
    catch (error) {
        console.error('Error in fetchAttendeesController:', error);
        res.status(500).json({ success: false, error: String(error) });
    }
}