import { moderateImage } from '../../middleware/moderate';
import { createPostService, postData, postResponse } from '../../services/posts/create-post-service';
import { Request, Response } from "express";
import { supabaseAdmin } from '../../config/supabase.js';

export async function createPostController(req: Request, res: Response) {
    try {
        // Get user ID from authenticated user (added by auth middleware)
        const userId = req.user?.id;
        
        console.log('🔍 DEBUG - Create Post Request:');
        console.log('  User from token:', req.user);
        console.log('  User ID:', userId);
        console.log('  Post data:', { 
            title: req.body.title, 
            building: req.body.building, 
            start_date: req.body.start_date, 
            end_date: req.body.end_date 
        });
        console.log('  Picture URL:', req.body.post_picture_url);
        console.log('  Tag IDs:', req.body.tag_ids);
        
        if (!userId) {
            console.error('❌ No user ID found in request');
            return res.status(401).json({ 
                success: false, 
                error: 'User not authenticated. Please log in to create a post.' 
            });
        }

        // Validate required fields
        const missingFields = [];
        if (!req.body.title?.trim()) missingFields.push('title');
        if (!req.body.body?.trim()) missingFields.push('body');
        if (!req.body.start_date) missingFields.push('start_date');

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
            .eq('id', userId)
            .single();

        if (userError || !userExists) {
            console.error('❌ User not found in database:', userId);
            console.error('   Error:', userError?.message);
            return res.status(400).json({
                success: false,
                error: 'User account not found in database. Please ensure your account is properly set up.',
                userId: userId,
                details: userError?.message
            });
        }

        console.log('✅ User verified in database:', userId);

        const newPost: postData = {
            title: String(req.body.title).trim(),
            body: String(req.body.body).trim(),
            userId: userId,
            building: req.body.building,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            postPictureUrl: req.body.post_picture_url,
            isPrivate: Boolean(req.body.is_private),
            tagIds: req.body.tag_ids || [],
        }

        if (newPost.postPictureUrl && !moderateImage(newPost.postPictureUrl)) {
            throw Error("Post picture did not pass moderation.");
        }

        const response = await createPostService(newPost);
        
        console.log('✅ Post created successfully:', response.id);
        if (newPost.tagIds && newPost.tagIds.length > 0) {
            console.log('✅ Tags added to post:', newPost.tagIds);
        }
        
        res.status(201).json({ success: true, data: response });
    } catch (error) {
        console.error('❌ Error creating post:', error);
        res.status(500).json({ success: false, error: String(error) });
    }
}