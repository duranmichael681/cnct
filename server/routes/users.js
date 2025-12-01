import express from 'express';
import { supabaseAdmin } from '../config/supabase.js';

const router = express.Router();
//TODO: Some functions will deprecated soon, implemented within profiles.ts
//I.E getting user profile by id
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

/**
 * DELETE /api/users/:id
 * Delete user account and all associated data
 * Body: { email, password }
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required for account deletion'
            });
        }

        // Verify the user exists
        const { data: userData, error: userError } = await supabaseAdmin
            .from('users')
            .select('email')
            .eq('id', id)
            .single();

        if (userError || !userData) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        // Verify email matches
        if (userData.email !== email) {
            return res.status(403).json({
                success: false,
                error: 'Email does not match account'
            });
        }

        // Delete all user's posts (cascade will handle related data like attendees, comments, etc.)
        const { error: postsError } = await supabaseAdmin
            .from('posts')
            .delete()
            .eq('organizer_id', id);

        if (postsError) {
            console.error('Error deleting user posts:', postsError);
            throw postsError;
        }

        // Delete user's attendee records
        const { error: attendeesError } = await supabaseAdmin
            .from('attendees')
            .delete()
            .eq('user_id', id);

        if (attendeesError) {
            console.error('Error deleting user attendees:', attendeesError);
        }

        // Delete user's follow relationships
        const { error: followsError } = await supabaseAdmin
            .from('follows')
            .delete()
            .or(`follower_id.eq.${id},following_id.eq.${id}`);

        if (followsError) {
            console.error('Error deleting user follows:', followsError);
        }

        // Delete user's notifications
        const { error: notificationsError } = await supabaseAdmin
            .from('notifications')
            .delete()
            .eq('user_id', id);

        if (notificationsError) {
            console.error('Error deleting user notifications:', notificationsError);
        }

        // Delete user's tag preferences
        const { error: tagsError } = await supabaseAdmin
            .from('user_tag_preferences')
            .delete()
            .eq('user_id', id);

        if (tagsError) {
            console.error('Error deleting user tag preferences:', tagsError);
        }

        // Delete user's settings
        const { error: settingsError } = await supabaseAdmin
            .from('user_settings')
            .delete()
            .eq('user_id', id);

        if (settingsError) {
            console.error('Error deleting user settings:', settingsError);
        }

        // Finally, delete the user record
        const { error: deleteUserError } = await supabaseAdmin
            .from('users')
            .delete()
            .eq('id', id);

        if (deleteUserError) {
            console.error('Error deleting user:', deleteUserError);
            throw deleteUserError;
        }

        // Delete from Supabase Auth
        const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(id);

        if (authDeleteError) {
            console.error('Error deleting user from auth:', authDeleteError);
            // Continue anyway since the database record is deleted
        }

        res.json({ 
            success: true, 
            message: 'Account and all associated data deleted successfully' 
        });
    } catch (error) {
        console.error('Error deleting user account:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
