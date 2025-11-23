import { Request, Response, Router } from 'express';
import { supabase } from '../server';


//TODO: import other necessary middlewares and controllrs here

// TODO: Replace the placeholder lambda functions with their respective controllers.

const messageRouter = Router();

//TODO: add middlewares and controllers later
messageRouter.get('/messages/threads/:eventId', /*middleware, controller*/ function(req: Request, res: Response) {
    try {
        // Middleware
        const {thread, error} = supabase.from('posts').select("*").eq("id", req.params.eventId);
        res.send(thread);
    } catch (error: any) {
        res.send("Message not found.");
    }
})
messageRouter.post('/messages', function(req: Request, res: Response) {
    try {
        // Middleware
        res.send("Messages");
    } catch(error: any) {
        res.send("Error");
    }
})
messageRouter.put('/messages/:id', function(req: Request, res: Response) {
    try {
        // Middleware
        res.send(req.params.id);
    } catch (error: any) {
        res.send("Message not found.");
    }
})
messageRouter.delete('/messages/:id', function(req: Request, res: Response) {
    try {
        // Middleware
        res.send(req.params.id);
    } catch (error: any) {
        res.send("Message not found.");
    }
})

export default messageRouter