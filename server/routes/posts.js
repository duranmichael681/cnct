import express from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/posts
 * Fetch all public posts
 */
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('posts')
            .select(`
                *,
                attendees(count)
            `)
            .eq('is_private', false)
            .order('start_date', { ascending: true });

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/posts/:id
 * Fetch a single post by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabaseAdmin
            .from('posts')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/posts
 * Create a new post
 * Body: { title, body, building, start_date, end_date, is_private, post_picture_url }
 * Note: organizer_id is taken from authenticated user (req.user)
 */
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, body, building, start_date, end_date, is_private = false, post_picture_url } = req.body;
        const organizerId = req.user?.id;

        console.log('🔍 DEBUG - Create Post Request:');
        console.log('  User from token:', req.user);
        console.log('  User ID:', organizerId);
        console.log('  Post data:', { title, building, start_date, end_date });
        console.log('  Picture URL:', post_picture_url);

        // Validate user is authenticated
        if (!organizerId) {
            console.error('❌ No user ID found in request');
            return res.status(401).json({
                success: false,
                error: 'User not authenticated. Please log in to create a post.'
            });
        }

        // Validate required fields
        const missingFields = [];
        if (!title?.trim()) missingFields.push('title');
        if (!body?.trim()) missingFields.push('body');
        if (!start_date) missingFields.push('start_date');

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                error: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Verify user exists in database
        console.log('🔍 Checking if user exists in database...');
        const { data: userExists, error: userError } = await supabaseAdmin
            .from('users')
            .select('id')
            .eq('id', organizerId)
            .single();

        if (userError || !userExists) {
            console.error('❌ User not found in database:', organizerId);
            console.error('   Error:', userError?.message);
            return res.status(400).json({
                success: false,
                error: 'User account not found in database. Please ensure your account is properly set up.',
                userId: organizerId,
                details: userError?.message
            });
        }

        console.log('✅ User verified in database:', organizerId);

        // Create the post
        const { data, error } = await supabaseAdmin
            .from('posts')
            .insert([
                {
                    title: title.trim(),
                    body: body.trim(),
                    organizer_id: organizerId,
                    building,
                    start_date,
                    end_date,
                    is_private,
                    post_picture_url,
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('❌ Error inserting post:', error);
            throw error;
        }

        console.log('✅ Post created successfully:', data.id);
        res.status(201).json({ success: true, data });
    } catch (error) {
        console.error('❌ Error creating post:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/posts/:id/toggle-attendance
 * Toggle attendance for a post
 * Note: user_id is taken from authenticated user (req.user)
 */
router.post('/:id/toggle-attendance', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated. Please log in to toggle attendance.'
            });
        }

        // Check if already attending
        const { data: existing } = await supabaseAdmin
            .from('attendees')
            .select('id')
            .eq('posts_id', id)
            .eq('user_id', userId)
            .single();

        if (existing) {
            // Remove attendance
            const { error } = await supabaseAdmin
                .from('attendees')
                .delete()
                .eq('posts_id', id)
                .eq('user_id', userId);

            if (error) throw error;
            res.json({ success: true, action: 'left', data: null });
        } else {
            // Add attendance
            const { data, error } = await supabaseAdmin
                .from('attendees')
                .insert([{ posts_id: id, user_id: userId }])
                .select()
                .single();

            if (error) throw error;
            res.json({ success: true, action: 'joined', data });
        }
    } catch (error) {
        console.error('Error toggling attendance:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/posts/:id/attendees
 * Get all attendees for a specific post
 */
router.get('/:id/attendees', async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabaseAdmin
            .from('attendees')
            .select(`
                *,
                users(
                    id,
                    username_email,
                    first_name,
                    last_name,
                    profile_picture_url
                )
            `)
            .eq('posts_id', id);

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching attendees:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
