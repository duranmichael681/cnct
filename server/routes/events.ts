import { Request, Response, Router } from 'express';
import { supabase } from '../server';
//TODO: import other necessary middlewares and controllrs here

const eventsRouter = Router();

//TODO: add middlewares and controllers later
eventsRouter.get('/events', /*middleware, controller*/ function(req: Request, res: Response) {
    try {
        // Add Middleware
        res.send("Events");
    } catch (error: any) {
        res.send("Error");
    }
})
eventsRouter.get('/events/:id', /*middleware, controller*/ function(req: Request, res: Response) {
    try {
        // Add Middleware
        res.send(req.params.id);
    } catch (error: any) {
        res.send("Error");
    }
}
)
eventsRouter.post('/events', /*middleware, controller*/ function(req: Request, res: Response) {
    try {
        // Add Middleware
        res.send("Events");
    } catch (error: any) {
        res.send("Error");
    }
})
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
eventsRouter.post('/events/:id/leave', /*middleware, controller*/ function(req: Request, res: Request) {
    try {
        // Add Middleware
        res.send(req.params.id);
    } catch (error: any) {
        res.send("Error");
    }
})
eventsRouter.get('/events/:id/attendees', /*middleware, controller*/ function(req: Request, res: Response) {
    try {
        // Add Middleware
        res.send(req.params.id);
    } catch (error: any) {
        res.send("Error");
    }
})

export default eventsRouter