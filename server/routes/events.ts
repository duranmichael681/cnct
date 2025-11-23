import { Request, Response, Router } from 'express';
import { supabase } from '../server';
import { EventControllerModule } from '../controllers/controller-module.js';
//TODO: import other necessary middlewares and controllrs here

const eventsRouter = Router();

//TODO: Are these in file controllers or what?
//      for now, i'm going to write my controllers but commented out

eventsRouter.get('/events', EventControllerModule.fetchPostsController)

eventsRouter.get('/events/:id',  EventControllerModule.fetchPostByIdController)

eventsRouter.post('/events', EventControllerModule.createPostController)

eventsRouter.put('/events/:id', EventControllerModule.updatePostController)

eventsRouter.delete('/events/:id', EventControllerModule.deletePostController)

eventsRouter.post('/events/:id/join', /*middleware, controller*/ function(req: Request, res: Response) {
    res.send("Joined event!");
})
eventsRouter.post('/events/:id/leave', EventControllerModule.removeAttendeeController)

eventsRouter.get('/events/:id/attendees', EventControllerModule.fetchAttendeesController)

export default eventsRouter

