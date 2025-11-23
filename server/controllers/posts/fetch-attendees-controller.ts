import { fetchAttendeesService, Attendee } from '../../services/posts/fetch-attendees-service.js';
import { Request, Response } from 'express';

export async function fetchAttendeesController(req: Request, res: Response): Promise<Attendee[]> {
    try {
        var eventId = req.params.id;
        const attendees = await fetchAttendeesService(eventId);
        res.send(attendees);
        return attendees;
    }
    catch (error) {
        console.error('Error in fetchAttendeesController:', error);
        res.send('Error in fetchAttendeesController:' + error);
        throw error;
    }
}