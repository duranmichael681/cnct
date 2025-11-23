import { Request, Response, Router } from 'express';
import { supabase } from '../server.js';
import { EventControllerModule } from '../controllers/controller-module.js';
//TODO: import other necessary middlewares and controllrs here

const postsRouter = Router();

//TODO: Are these in file controllers or what?
//      for now, i'm going to write my controllers but commented out

postsRouter.get('/events', EventControllerModule.fetchPostsController)

postsRouter.get('/events/:id',  EventControllerModule.fetchPostByIdController)

postsRouter.post('/events', EventControllerModule.createPostController)

postsRouter.put('/events/:id', EventControllerModule.updatePostController)

postsRouter.delete('/events/:id', EventControllerModule.deletePostController)

postsRouter.post('/events/:id/join', /*middleware, controller*/ function(req: Request, res: Response) {
    res.send("Joined event!");
})
postsRouter.post('/events/:id/leave', EventControllerModule.removeAttendeeController)

postsRouter.get('/events/:id/attendees', EventControllerModule.fetchAttendeesController)

export default postsRouter

