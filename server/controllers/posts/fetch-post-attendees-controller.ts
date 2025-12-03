import type { Request, Response } from 'express';
import { fetchAttendeesService } from '../../services/posts/fetch-attendees-service.js';

/**
 * GET /api/posts/:id/attendees
 * Get all attendees for a specific post
 */
export async function fetchPostAttendeesController(req: Request, res: Response) {
    try {
        const { id } = req.params;

        const attendees = await fetchAttendeesService(id);

        res.json({ success: true, data: attendees });
    } catch (error) {
        console.error('❌ Error fetching attendees:', error);
        res.status(500).json({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
        });
    }
}
