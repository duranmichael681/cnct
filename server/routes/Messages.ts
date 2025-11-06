import { Request, Response, Router } from 'express';
import { supabase } from '../server';


//TODO: import other necessary middlewares and controllrs here

const messageRouter = Router();

//TODO: add middlewares and controllers later
messageRouter.get('/messages/threads/:eventId', /*middleware, controller*/ function(req: Request, res: Response) {
    try {
        // Middleware
        res.send(req.params.eventId);
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