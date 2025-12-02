import type { Request, Response } from 'express';
import { toggleAttendanceService } from '../../services/posts/toggle-attendance-service.js';

/**
 * POST /api/posts/:id/attend
 * Toggle attendance (RSVP) for a post
 * If user is attending, removes them. If not attending, adds them.
 */
export async function toggleAttendanceController(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated. Please log in to toggle attendance.'
            });
        }

        const result = await toggleAttendanceService(id, userId);

        res.json({ 
            success: true, 
            action: result.action,
            data: result.data 
        });
    } catch (error) {
        console.error('❌ Error toggling attendance:', error);
        res.status(500).json({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
        });
    }
}
