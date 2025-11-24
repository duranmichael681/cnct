import { Request, Response, Router } from 'express';
import { supabase } from '../server.js';
import { EventControllerModule } from '../controllers/controller-module.js';
//TODO: import other necessary middlewares and controllrs here

const postsRouter = Router();

//TODO: Are these in file controllers or what?
//      for now, i'm going to write my controllers but commented out

postsRouter.get('/', EventControllerModule.fetchPostsController)

postsRouter.get('/:id',  EventControllerModule.fetchPostByIdController)

postsRouter.post('/', EventControllerModule.createPostController)

postsRouter.put('/:id', EventControllerModule.updatePostController)

postsRouter.delete('/:id', EventControllerModule.deletePostController)

postsRouter.post('/:id/join', /*middleware, controller*/ function(req: Request, res: Response) {
    res.send("Joined event!");
})
postsRouter.post('/:id/leave', EventControllerModule.removeAttendeeController)

postsRouter.get('/:id/attendees', EventControllerModule.fetchAttendeesController)

export default postsRouter

