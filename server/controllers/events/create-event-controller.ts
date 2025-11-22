import { createEventService } from "../../services/events/create-event-service.js"
import {Response, Request} from 'express'

export async function createEventController(req: Request, res: Response)
{
    try {
        var title = req.params.title;
        var date = req.params.date;
        var is_private = req.params.is_private;
        var created_at = req.params.created_at;
    } catch(error: any) {
        return res.send("ERROR! Missing parameters.");
    } 

    try {
        res.send(await createEventService(title, date, is_private, created_at));
    } catch(error: any) {
        res.send("Supabase failure");
    }
}