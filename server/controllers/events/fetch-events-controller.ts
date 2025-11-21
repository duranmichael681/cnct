import { Request, Response} from 'express';
import { fetchEventsService } from "../../services/events/fetch-events-service";


export function fetchEventsController(req: Request, res: Response)
{
    try {
        var result = fetchEventsService();
        res.send(result);
    } catch (error: any)
    {
        res.send("Failure");
    }
}