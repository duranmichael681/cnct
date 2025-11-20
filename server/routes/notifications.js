import express from 'express';
import { supabaseAdmin } from '../config/supabase.js';

const router = express.Router();

/**
 * GET /api/notifications/:userId
 * Get all notifications for a user
 */
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const { data, error } = await supabaseAdmin
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/notifications/:id/mark-read
 * Mark a notification as read using the mark_notification_read function
 */
router.post('/:id/mark-read', async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabaseAdmin.rpc('mark_notification_read', {
            p_notification_id: id,
        });

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/notifications/:userId/unread-count
 * Get count of unread notifications for a user
 */
router.get('/:userId/unread-count', async (req, res) => {
    try {
        const { userId } = req.params;

        const { count, error } = await supabaseAdmin
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('is_read', false);

        if (error) throw error;

        res.json({ success: true, count });
    } catch (error) {
        console.error('Error counting unread notifications:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
