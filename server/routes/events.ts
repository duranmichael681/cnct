import { Request, Response, Router } from 'express';
//TODO: import other necessary middlewares and controllrs here

const eventsRouter = Router();

//TODO: add middlewares and controllers later
eventsRouter.get('/events', /*middleware, controller*/ function(response: Response, request: Request) {
    try {
        // Add Middleware
        response.send("Events");
    } catch (error: any) {
        response.send("Error");
    }
})
eventsRouter.get('/events/:id', /*middleware, controller*/ function(response: Response, request: Request) {
    try {
        // Add Middleware
        response.send(request.params.id);
    } catch (error: any) {
        response.send("Error");
    }
}
)
eventsRouter.post('/events', /*middleware, controller*/ function(response: Response, request: Request) {
    try {
        // Add Middleware
        response.send("Events");
    } catch (error: any) {
        response.send("Error");
    }
})
eventsRouter.put('/events/:id', /*middleware, controller*/ function(response: Response, request: Request) {
    try {
        // Add Middleware
        response.send(request.params.id);
    } catch (error: any) {
        response.send("Error");
    }
})
eventsRouter.delete('/events/:id', /*middleware, controller*/ function(response: Response, request: Request) {
    try {
        // Add Middleware
        response.send(request.params.id);
    } catch (error: any) {
        response.send("Error");
    }
})
eventsRouter.post('/events/:id/join', /*middleware, controller*/ function(response: Response, request: Request) {
    try {
        // Add Middleware
        response.send(request.params.id);
    } catch (error: any) {
        response.send("Error");
    }
})
eventsRouter.post('/events/:id/leave', /*middleware, controller*/ function(response: Response, request: Request) {
    try {
        // Add Middleware
        response.send(request.params.id);
    } catch (error: any) {
        response.send("Error");
    }
})
eventsRouter.get('/events/:id/attendees', /*middleware, controller*/ function(response: Response, request: Request) {
    try {
        // Add Middleware
        response.send(request.params.id);
    } catch (error: any) {
        response.send("Error");
    }
})

export default eventsRouter