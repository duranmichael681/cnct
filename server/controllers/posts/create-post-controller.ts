import { createPostService, postData, postResponse } from '../../services/posts/create-post-service';
import {Request, Response } from "express";

export async function createPostController(req: Request, res: Response): Promise<postResponse> {
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
        res.send(response);
        return response;
    } catch (error) {
        console.error('Error in createEventController:', error);
        res.send('Error in createEventController:' + error)
        throw error;
    }
}