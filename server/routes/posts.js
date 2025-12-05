import express from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { authMiddleware } from '../middleware/auth.js';
import { PostControllerModule } from '../controllers/controller-module.js';

const router = express.Router();

/**
 * GET /api/posts
 * Fetch all public posts, optionally filtered by user's tag preferences
 * Query params: ?userId=xxx to filter by user preferences
 */
router.get('/', async (req, res) => {
    try {
        console.log('🔥 GET /posts endpoint hit with userId:', req.query.userId);
        const { userId } = req.query;

        if (userId) {
            // Fetch user's tag preferences
            const { data: userPrefs, error: prefsError } = await supabaseAdmin
                .from('user_tag_preferences')
                .select('tag_id')
                .eq('user_id', userId);

            if (prefsError) throw prefsError;

            if (userPrefs && userPrefs.length > 0) {
                // User has tag preferences - show posts matching those tags OR posts with no tags
                const tagIds = userPrefs.map(pref => pref.tag_id);

                // Get posts that match user's tag preferences
                const { data: postTags, error: postTagsError } = await supabaseAdmin
                    .from('post_tags')
                    .select('post_id')
                    .in('tag_id', tagIds);

                if (postTagsError) throw postTagsError;

                const taggedPostIds = [...new Set(postTags.map(pt => pt.post_id))];

                // Get all posts
                const { data: allPosts, error: allPostsError } = await supabaseAdmin
                    .from('posts')
                    .select(`
                        *,
                        users!posts_organizer_id_fkey (
                            id,
                            first_name,
                            last_name,
                            profile_picture_url
                        ),
                        comments:comments(count)
                    `)
                    .eq('is_private', false)
                    .order('start_date', { ascending: true });

                if (allPostsError) {
                    console.error('Error fetching filtered posts:', allPostsError);
                    throw allPostsError;
                }

                // Fetch all attendees separately
                const { data: allAttendees, error: attendeesError } = await supabaseAdmin
                    .from('attendees')
                    .select('user_id, posts_id');

                if (attendeesError) {
                    console.error('Error fetching attendees:', attendeesError);
                }

                // Group attendees by post_id
                const attendeesByPost = {};
                if (allAttendees) {
                    allAttendees.forEach(attendee => {
                        if (!attendeesByPost[attendee.posts_id]) {
                            attendeesByPost[attendee.posts_id] = [];
                        }
                        attendeesByPost[attendee.posts_id].push({ user_id: attendee.user_id });
                    });
                }

                // Add attendees to posts
                const postsWithAttendees = allPosts.map(post => ({
                    ...post,
                    attendees: attendeesByPost[post.id] || []
                }));
                
                // Log sample to verify attendees structure
                if (postsWithAttendees && postsWithAttendees.length > 0) {
                    console.log('📦 Sample filtered post attendees:', JSON.stringify(postsWithAttendees[0].attendees, null, 2));
                }

                // Get all post IDs that have tags
                const { data: allPostTags, error: allPostTagsError } = await supabaseAdmin
                    .from('post_tags')
                    .select('post_id');

                if (allPostTagsError) throw allPostTagsError;

                const postsWithTags = new Set(allPostTags.map(pt => pt.post_id));

                // Filter: show posts that match user's tags OR posts with no tags
                const filteredPosts = postsWithAttendees.filter(post => 
                    taggedPostIds.includes(post.id) || !postsWithTags.has(post.id)
                );

                return res.json({ success: true, data: filteredPosts });
            }
        }

        // Default: fetch all public posts (no preferences or no userId)
        const { data: posts, error } = await supabaseAdmin
            .from('posts')
            .select(`
                *,
                users!posts_organizer_id_fkey (
                    id,
                    first_name,
                    last_name,
                    profile_picture_url
                ),
                comments:comments(count)
            `)
            .eq('is_private', false)
            .order('start_date', { ascending: true });

        if (error) {
            console.error('Error fetching default posts:', error);
            throw error;
        }

        // Fetch all attendees separately and group by post_id
        const { data: allAttendees, error: attendeesError } = await supabaseAdmin
            .from('attendees')
            .select('user_id, posts_id');

        if (attendeesError) {
            console.error('Error fetching attendees:', attendeesError);
        }

        // Group attendees by post_id
        const attendeesByPost = {};
        if (allAttendees) {
            allAttendees.forEach(attendee => {
                if (!attendeesByPost[attendee.posts_id]) {
                    attendeesByPost[attendee.posts_id] = [];
                }
                attendeesByPost[attendee.posts_id].push({ user_id: attendee.user_id });
            });
        }

        // Add attendees to each post
        const data = posts.map(post => ({
            ...post,
            attendees: attendeesByPost[post.id] || []
        }));

        // Debug: Log first post to see structure
        if (data && data.length > 0) {
            console.log('📦 Sample post attendees:', JSON.stringify(data[0].attendees, null, 2));
        }

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
        const { title, body, building, start_date, end_date, is_private = false, post_picture_url, tag_ids } = req.body;
        const organizerId = req.user?.id;

        console.log('🔍 DEBUG - Create Post Request:');
        console.log('  User from token:', req.user);
        console.log('  User ID:', organizerId);
        console.log('  Post data:', { title, building, start_date, end_date });
        console.log('  Picture URL:', post_picture_url);
        console.log('  Tag IDs:', tag_ids);

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

        // Insert tags if provided
        if (tag_ids && Array.isArray(tag_ids) && tag_ids.length > 0) {
            const postTags = tag_ids.map(tagId => ({
                post_id: data.id,
                tag_id: parseInt(tagId)
            }));

            const { error: tagError } = await supabaseAdmin
                .from('post_tags')
                .insert(postTags);

            if (tagError) {
                console.error('⚠️ Error inserting tags (post created):', tagError);
                // Don't fail the request if tags fail
            } else {
                console.log('✅ Tags added to post:', tag_ids);
            }
        }

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
router.post('/:id/toggle-attendance', authMiddleware, PostControllerModule.toggleAttendanceController);

/**
 * GET /api/posts/:id/attendees
 * Get all attendees for a specific post
 */
router.get('/:id/attendees', PostControllerModule.fetchPostAttendeesController);

/**
 * PUT /api/posts/:id
 * Update an existing post
 * Body: { title, body, building, start_date, end_date, is_private, post_picture_url }
 * Note: Only the post organizer can update their post
 */
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, body, building, start_date, end_date, is_private, post_picture_url } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated. Please log in to update a post.'
            });
        }

        // Check if post exists and user is the organizer
        const { data: post, error: fetchError } = await supabaseAdmin
            .from('posts')
            .select('organizer_id')
            .eq('id', id)
            .single();

        if (fetchError || !post) {
            return res.status(404).json({
                success: false,
                error: 'Post not found.'
            });
        }

        if (post.organizer_id !== userId) {
            return res.status(403).json({
                success: false,
                error: 'You do not have permission to update this post.'
            });
        }

        // Update the post
        const updateData = {};
        if (title !== undefined) updateData.title = title.trim();
        if (body !== undefined) updateData.body = body.trim();
        if (building !== undefined) updateData.building = building;
        if (start_date !== undefined) updateData.start_date = start_date;
        if (end_date !== undefined) updateData.end_date = end_date;
        if (is_private !== undefined) updateData.is_private = is_private;
        if (post_picture_url !== undefined) updateData.post_picture_url = post_picture_url;

        const { data, error } = await supabaseAdmin
            .from('posts')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        console.log('✅ Post updated successfully:', id);
        res.json({ success: true, data });
    } catch (error) {
        console.error('❌ Error updating post:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * DELETE /api/posts/:id
 * Delete a post
 * Note: Only the post organizer can delete their post
 */
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated. Please log in to delete a post.'
            });
        }

        // Check if post exists and user is the organizer
        const { data: post, error: fetchError } = await supabaseAdmin
            .from('posts')
            .select('organizer_id')
            .eq('id', id)
            .single();

        if (fetchError || !post) {
            return res.status(404).json({
                success: false,
                error: 'Post not found.'
            });
        }

        if (post.organizer_id !== userId) {
            return res.status(403).json({
                success: false,
                error: 'You do not have permission to delete this post.'
            });
        }

        // Delete the post (CASCADE will automatically handle related records:
        // attendees, comments, comment_votes, post_tags)
        const { error } = await supabaseAdmin
            .from('posts')
            .delete()
            .eq('id', id);

        if (error) throw error;

        console.log('✅ Post deleted successfully:', id);
        res.json({ success: true, message: 'Post deleted successfully' });
    } catch (error) {
        console.error('❌ Error deleting post:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
