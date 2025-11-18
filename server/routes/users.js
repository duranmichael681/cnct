import express from 'express';
import { supabaseAdmin } from '../config/supabase.js';

const router = express.Router();

/**
 * GET /api/users/:id
 * Get user profile by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/users/:id/posts
 * Get all posts created by a user
 */
router.get('/:id/posts', async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabaseAdmin
            .from('posts')
            .select(`
                *,
                attendees(count)
            `)
            .eq('organizer_id', id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching user posts:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/users/:id/attending
 * Get all posts a user is attending
 */
router.get('/:id/attending', async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabaseAdmin
            .from('attendees')
            .select(`
                *,
                posts(*)
            `)
            .eq('user_id', id);

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching user attendance:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/users/:id/settings
 * Update user settings using the set_user_setting function
 * Body: { setting_name, status }
 */
router.post('/:id/settings', async (req, res) => {
    try {
        const { setting_name, status } = req.body;

        if (!setting_name || typeof status !== 'boolean') {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: setting_name (string), status (boolean)'
            });
        }

        const { data, error } = await supabaseAdmin.rpc('set_user_setting', {
            p_setting_name: setting_name,
            p_status: status,
        });

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error) {
        console.error('Error updating user settings:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/users/:id/tags/toggle
 * Toggle user interest tag using the toggle_user_tag function
 * Body: { tag_id }
 */
router.post('/:id/tags/toggle', async (req, res) => {
    try {
        const { tag_id } = req.body;

        if (!tag_id) {
            return res.status(400).json({
                success: false,
                error: 'Missing required field: tag_id'
            });
        }

        const { data, error } = await supabaseAdmin.rpc('toggle_user_tag', {
            p_tag_id: tag_id,
        });

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error) {
        console.error('Error toggling user tag:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/users/:id/tags
 * Get all tags for a user
 */
router.get('/:id/tags', async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabaseAdmin
            .from('user_tag_preferences')
            .select(`
                *,
                tags(*)
            `)
            .eq('user_id', id);

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching user tags:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
