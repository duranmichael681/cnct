import { Request, Response, Router } from 'express';
import { supabase } from '../server';
//import other necessary middlewares and controllrs here

const profileRouter = Router();

//TODO: add middlewares and controllers later
profileRouter.get('/profile/:userId', function(req: Request, res: Response) {
    try {
        // Middleware Service
        res.send(req.params.id);
    } catch (error: any) {
        res.send("User not found");
    }
})
profileRouter.put('/profile/:userId', function(req: Request, res: Response) {
    try {
        // Middleware Service
        res.send(req.params.id);
    } catch (error: any) {
        res.send("User not found");
    }
})
profileRouter.get('/profile/:userId/events', /*middleware, controller*/ function(req: Request, res: Response) {
    try {
        // Middleware Services
        res.send(req.params.userId);
    } catch (error: any) {
        res.send("User not found");
    }
})
profileRouter.get('/profile/:userId/following', /*middleware, controller*/ function(req: Request, res: Response) {
    try {
        // Middleware Services
        res.send(req.params.userId);
    } catch (error: any) {
        res.send("User not found");
    }
})

export default profileRouter