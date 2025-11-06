import { Router, Request, Response } from 'express';
//import other necessary middlewares and controllrs here

const userRouter = Router();

//TODO: add middlewares and controllers later
userRouter.get('/users/:id', function(request: Request, response: Response) {
    try {
        // Middleware Service
        response.send(request.params.id);
    } catch (error: any) {
        Response.send("User not found");
    }
})
userRouter.put('/users/:id', function(request: Request, response: Response) {
    try {
        // Middleware Service
        response.send(request.params.id);
    } catch (error: any) {
        response.send("User not found");
    }
})
userRouter.get('/users/:id/events', /*middleware, controller*/ function(request: Request, response: Response) {
    try {
        // Middleware Services
        response.send(request.params.id);
    } catch (error: any) {
        response.send("User not found");
    }
})
userRouter.get('/users/:id/friends', /*middleware, controller*/ function(request: Request, response: Response) {
    try {
        // Middleware Services
        response.send(request.params.id);
    } catch (error: any) {
        response.send("User not found");
    }
})

export default userRouter