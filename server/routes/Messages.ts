import { Router } from 'express';
//TODO: import other necessary middlewares and controllrs here

const messageRouter = Router();

//TODO: add middlewares and controllers later
messageRouter.get('/messages/threads/:eventId', /*middleware, controller*/)
messageRouter.post('/messages', /*middleware, controller*/)
messageRouter.put('/messages/:id', /*middleware, controller*/)
messageRouter.delete('/messages/:id', /*middleware, controller*/)

export default messageRouter