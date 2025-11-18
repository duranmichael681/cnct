import { Request, Response, Router } from 'express';
import { supabase } from '../server';
//import other necessary middlewares and controllrs here

const profileRouter = Router();

//TODO: add middlewares and controllers later
profileRouter.get('/profile/:userId', function(req: Request, res: Response) {
    try {
        // Middleware Service
        const {data, error} = supabase.from('users')
        .select("profile_picture_url, first_name, last_name, pronouns, degree_program, description")
        .eq("id", req.params.userId);
        if(error) {
            console.log("Supabase error retrieving user data. Error: ");
            console.log(error);
        }

        res.send(data);
    } catch (error: any) {
        res.send("Error retrieving user data!");
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
profileRouter.get('/profile/:userId/followers', /*middleware, controller*/ function(req: Request, res: Response) {
    try {
        // Middleware Services
        res.send(req.params.userId);
    } catch (error: any) {
        res.send("User not found");
    }
})

export default profileRouter