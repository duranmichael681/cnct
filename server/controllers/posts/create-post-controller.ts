import { createPostService, postData, postResponse } from '../../services/posts/create-post-service';
import {Request, Response } from "express";

export async function createPostController(req: Request, res: Response) {
    try {
        // Get user ID from authenticated user (added by auth middleware)
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(401).json({ 
                success: false, 
                error: 'User not authenticated. Please log in to create a post.' 
            });
        }

        const newPost: postData = {
            title: String(req.body.title),
            body: String(req.body.body),
            userId: userId,
            building: req.body.building,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            postPictureUrl: req.body.post_picture_url,
            isPrivate: Boolean(req.body.is_private),
            tagIds: req.body.tag_ids || [],
        }

        const response = await createPostService(newPost);
        res.json({ success: true, data: response });
    } catch (error) {
        console.error('Error in createPostController:', error);
        res.status(500).json({ success: false, error: String(error) });
    }
}