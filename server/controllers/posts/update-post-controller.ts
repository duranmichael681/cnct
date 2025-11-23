import { updatePostService } from '../../services/posts/update-post-service';
import { Post } from '../../services/posts/fetch-post-by-id-service';
import { Request, Response } from 'express';

export async function updatePostController(req: Request, res: Response/* eventId: string, eventData: Partial<Post>*/): Promise<Post> {
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
        const updatedEvent = await updatePostService(eventId, eventData);
        res.send(updatedEvent);
        return updatedEvent
    } catch (error) {
        console.error('Error in updateEventController:', error);
        res.send('Error in updateEventController:' + error);
        throw error;
    }
}