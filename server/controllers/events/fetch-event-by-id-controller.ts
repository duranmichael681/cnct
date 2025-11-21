import { Request, Response} from 'express';
import { fetchEventsByID } from "../../services/events/fetch-event-by-id-service.js";

export function fetchEventsByIDController(req: Request, res: Response) {
    try {
        var id = req.params.id;
    } catch(error: any) {
        res.send("ID not identified. Please try again");
    }

    try 
    {
        var result = fetchEventsByID(id);
        res.send(result);
    } catch(error: any) {
        res.send("Event not found.");
    }
}