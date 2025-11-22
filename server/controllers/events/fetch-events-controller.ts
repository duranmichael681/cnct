import { Request, Response} from 'express';
import { fetchEventsService } from "../../services/events/fetch-events-service.js";


export async function fetchEventsController(req: Request, res: Response)
{
    try {
        res.send(await fetchEventsService());
    } catch (error: any)
    {
        res.send("Failure: " + error);
    }
}