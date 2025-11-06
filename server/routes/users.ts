import { Request, Response, Router } from 'express';
import { supabase } from '../server.js';
//import other necessary middlewares and controllrs here

const userRouter = Router();

//TODO: add middlewares and controllers later
userRouter.get('/users/:id', function(req: Request, res: Response) {
    try {
        // Middleware Service
        res.send(req.params.id);
    } catch (error: any) {
        res.send("User not found");
    }
})
userRouter.put('/users/:id', function(req: Request, res: Response) {
    try {
        // Middleware Service
        res.send(req.params.id);
    } catch (error: any) {
        res.send("User not found");
    }
})
userRouter.get('/users/:id/events', /*middleware, controller*/ function(req: Request, res: Response) {
    try {
        // Middleware Services
        res.send(req.params.id);
    } catch (error: any) {
        res.send("User not found");
    }
})
userRouter.get('/users/:id/friends', /*middleware, controller*/ function(req: Request, res: Response) {
    try {
        // Middleware Services
        res.send(req.params.id);
    } catch (error: any) {
        res.send("User not found");
    }
})

export default userRouter