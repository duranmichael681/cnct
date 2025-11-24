import { Request, Response, Router } from 'express';
import { supabase } from '../server.js';
import { EventControllerModule } from '../controllers/controller-module.js';
//TODO: import other necessary middlewares and controllrs here

const postsRouter = Router();

//TODO: Are these in file controllers or what?
//      for now, i'm going to write my controllers but commented out

postsRouter.get('/posts', EventControllerModule.fetchPostsController)

postsRouter.get('/posts/:id',  EventControllerModule.fetchPostByIdController)

postsRouter.post('/posts', EventControllerModule.createPostController)

postsRouter.put('/posts/:id', EventControllerModule.updatePostController)

postsRouter.delete('/posts/:id', EventControllerModule.deletePostController)

postsRouter.post('/posts/:id/join', /*middleware, controller*/ function(req: Request, res: Response) {
    res.send("Joined event!");
})
postsRouter.post('/posts/:id/leave', EventControllerModule.removeAttendeeController)

postsRouter.get('/posts/:id/attendees', EventControllerModule.fetchAttendeesController)

export default postsRouter

