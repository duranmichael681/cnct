import { Router } from 'express';
//TODO: import other necessary middlewares and controllrs here

const eventsRouter = Router();

//TODO: add middlewares and controllers later
eventsRouter.get('/events', /*middleware, controller*/)
eventsRouter.get('/events/:id', /*middleware, controller*/)
eventsRouter.post('/events', /*middleware, controller*/)
eventsRouter.put('/events/:id', /*middleware, controller*/)
eventsRouter.delete('/events/:id', /*middleware, controller*/)
eventsRouter.post('/events/:id/join', /*middleware, controller*/)
eventsRouter.post('/events/:id/leave', /*middleware, controller*/)
eventsRouter.get('/events/:id/attendees', /*middleware, controller*/)

export default eventsRouter