import { removeAttendeesService } from "../../services/events/remove-attendee-service";
import {Request, Response} from 'express';

export function removeAttendeesController(req: Request, res: Response)
{
    try {
        var user_id = req.params.user_id;
    } catch(error: any) {
        res.send("User not found");
    }
    try{
        removeAttendeesService(user_id);
    } catch(error: any) {
        res.send("Supabase failure");
    }
}