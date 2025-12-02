import { updatePostService } from '../../services/posts/update-post-service';
import { Post } from '../../services/posts/fetch-post-by-id-service';
import { Request, Response } from 'express';
import { moderateImage } from '../../middleware/moderate';

export async function updatePostController(req: Request, res: Response) {
    try {
        const eventId = req.params.id;
        const eventData: Partial<Post> = {
            id: eventId,
            title: req.body.title,
            body: req.body.body,
            organizerId: req.body.organizer_id,
            building: req.body.building,
            startDate: req.body.start_date,
            endDate: req.body.end_date,
            postPictureUrl: req.body.post_picture_url,
            createdAt: req.body.created_at,
            isPrivate: req.body.is_private,
            rsvp: req.body.rsvp
        }

        if(!moderateImage(eventData.postPictureUrl))
            throw Error("New image does not pass moderation.");

        const updatedEvent = await updatePostService(eventId, eventData);
        res.json({ success: true, data: updatedEvent });
    } catch (error) {
        console.error('Error in updatePostController:', error);
        res.status(500).json({ success: false, error: String(error) });
    }
}