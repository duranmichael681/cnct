import { Request, Response, Router } from 'express';
import { supabase } from '../server';
import dotenv from 'dotenv';

//TODO: import other necessary middlewares and controllrs here

const messageRouter = Router();

//TODO: add middlewares and controllers later
messageRouter.get('/messages/threads/:eventId', /*middleware, controller*/ function(request: Request, response: Response) {
    try {
        // Middleware
        response.send(request.params.eventId);
    } catch (error: any) {
        response.send("Message not found.");
    }
})
messageRouter.post('/messages', function(response: Response, request: Request) {
    try {
        // Middleware
        response.send("Messages");
    } catch(error: any) {
        response.send("Error");
    }
})
messageRouter.put('/messages/:id', function(response: Response, request: Request) {
    try {
        // Middleware
        response.send(request.params.id);
    } catch (error: any) {
        response.send("Message not found.");
    }
})
messageRouter.delete('/messages/:id', function(response: Response, request: Request) {
    try {
        // Middleware
        response.send(request.params.id);
    } catch (error: any) {
        response.send("Message not found.");
    }
})

export default messageRouter