import { fetchAttendessService } from '../../services/events/fetch-attendees-service.js'
import {Response, Request} from 'express'

export async function fetchAttendeesController( req: Request, res: Response)
{
    try {
        var post_id = req.params.id;
    } catch (error: any)  {
        res.send("Error!");
        return null;
    }

    try
    {
        res.send(await fetchAttendessService(post_id));
    } catch (error: any) {
        res.send("Failed to get attendees: " + error);
    }
}