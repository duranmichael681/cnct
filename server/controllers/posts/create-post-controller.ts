import { createPostService, postData, postResponse } from '../../services/posts/create-post-service';
import {Request, Response } from "express";

export async function createPostController(req: Request, res: Response) {
    try {
        const newPost: postData = {
            title: String(req.query.title),
            content: String(req.query.content),
            userId: String(req.query.userId),
            building: String(req.query.building),
            postPictureUrl: String(req.query.postPictureUrl),
            isPrivate: Boolean(req.query.isPrivate),
        }

        const response = await createPostService(newPost);
        res.json({ success: true, data: response });
    } catch (error) {
        console.error('Error in createPostController:', error);
        res.status(500).json({ success: false, error: String(error) });
    }
}