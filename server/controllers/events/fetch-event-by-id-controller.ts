import { Request, Response} from 'express';
import { fetch_events_by_id } from "../../services/events/fetch-event-by-id-service.js";

export function fethc_events_by_id_controller(req: Request, res: Response) {
    try {
        var id = req.params.id;
    } catch(error: any) {
        res.send("ID not identified. Please try again");
    }

    try 
    {
        var result = fetch_events_by_id(id);
        res.send(result);
    } catch(error: any) {
        res.send("Event not found.");
    }
}