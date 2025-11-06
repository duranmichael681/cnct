import { Router, Request, Response } from 'express';
//import other necessary middlewares and controllrs here

const userRouter = Router();

//TODO: add middlewares and controllers later
userRouter.get('/users/:id', function(request: Request, response: Response) {
    try {
        Response.send(request.params.id);
    } catch (error: any) {
        Response.send("User not found");
    }
})
userRouter.put('/users/:id', /*middleware, controller*/)
userRouter.get('/users/:id/events', /*middleware, controller*/)
userRouter.get('/users/:id/friends', /*middleware, controller*/)

export default userRouter