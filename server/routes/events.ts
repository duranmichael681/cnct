import { Request, Response, Router } from 'express';
//TODO: import other necessary middlewares and controllrs here
import { fetchEventsController } from "../controllers/events/fetch-events-controller.js";
import { fetchEventsByIDController } from "../controllers/events/fetch-event-by-id-controller.js";
import { createEventController } from "../controllers/events/create-event-controller.js";
import { removeAttendeesController } from "../controllers/events/remove-attendee-controller.js";

const eventsRouter = Router();

/*
    TODO: Replace each lambda function with their respective controller.
    The functions can then be put inside the appropriate service.
 */

//TODO: add middlewares and controllers later
eventsRouter.get('/events', fetchEventsController);

eventsRouter.get('/events/:id', fetchEventsByIDController);

eventsRouter.post('/events', createEventController);

eventsRouter.put('/events/:id', /*middleware, controller*/ function(req: Request, res: Response) {
    try {
        // Add Middleware
        res.send(req.params.id);
    } catch (error: any) {
        res.send("Error");
    }
})
eventsRouter.delete('/events/:id', /*middleware, controller*/ function(req: Request, res: Response) {
    try {
        // Add Middleware
        res.send(req.params.id);
    } catch (error: any) {
        res.send("Error");
    }
})
eventsRouter.post('/events/:id/join', /*middleware, controller*/ function(req: Request, res: Response) {
    try {
        // Add Middleware
        res.send(req.params.id);
    } catch (error: any) {
        res.send("Error");
    }
})

eventsRouter.post('/events/:id/leave', removeAttendeesController);

eventsRouter.get('/events/:id/attendees', /*middleware, controller*/ function(req: Request, res: Response) {
    try {
        // Add Middleware
        res.send(req.params.id);
    } catch (error: any) {
        res.send("Error");
    }
})

export default eventsRouter