import express from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/tags
 * Get all available tags
 */
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('tags')
            .select('*')
            .order('code', { ascending: true });

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching tags:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/tags/:id
 * Get a specific tag by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabaseAdmin
            .from('tags')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching tag:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/tags/user/:userId/preferences
 * Get user's tag preferences
 */
router.get('/user/:userId/preferences', async (req, res) => {
    try {
        const { userId } = req.params;

        const { data, error } = await supabaseAdmin
            .from('user_tag_preferences')
            .select(`
                tag_id,
                tags (
                    id,
                    code
                )
            `)
            .eq('user_id', userId);

        if (error) throw error;

        const tagPreferences = data.map(pref => ({
            id: pref.tags.id,
            code: pref.tags.code
        }));

        res.json({ success: true, data: tagPreferences });
    } catch (error) {
        console.error('Error fetching user tag preferences:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/tags/user/preferences
 * Update user's tag preferences (replaces all existing preferences)
 */
router.post('/user/preferences', authMiddleware, async (req, res) => {
    try {
        const { tag_ids } = req.body; // Array of tag IDs
        const userId = req.user.id;

        if (!Array.isArray(tag_ids)) {
            return res.status(400).json({ success: false, error: 'tag_ids must be an array' });
        }

        // Delete existing preferences
        await supabaseAdmin
            .from('user_tag_preferences')
            .delete()
            .eq('user_id', userId);

        // Insert new preferences
        if (tag_ids.length > 0) {
            const preferences = tag_ids.map(tag_id => ({
                user_id: userId,
                tag_id
            }));

            const { error: insertError } = await supabaseAdmin
                .from('user_tag_preferences')
                .insert(preferences);

            if (insertError) throw insertError;
        }

        res.json({ success: true, message: 'Tag preferences updated successfully' });
    } catch (error) {
        console.error('Error updating tag preferences:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
