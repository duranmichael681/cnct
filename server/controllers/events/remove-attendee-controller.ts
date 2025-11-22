import { removeAttendeesService } from "../../services/events/remove-attendee-service.js";
import {Request, Response} from 'express';

export async function removeAttendeesController(req: Request, res: Response)
{
    try {
        var user_id = req.params.user_id;
    } catch(error: any) {
        res.send("Invalid ID");
    }
    try{
        res.send(await removeAttendeesService(user_id));
    } catch(error: any) {
        res.send("Supabase failure");
    }
}