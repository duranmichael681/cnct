import { Request, Response} from 'express';
import { fetchEventsByID } from "../../services/events/fetch-event-by-id-service.js";

export async function fetchEventsByIDController(req: Request, res: Response) {
    try {
        var id = req.params.id;
    } catch(error: any) {
        res.send("ID not identified. Please try again");
    }

    try 
    {
        res.send(await fetchEventsByID(id));
    } catch(error: any) {
        res.send("Event not found.");
    }
}