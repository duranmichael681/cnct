import { Request, Response, Router } from 'express';
import { supabase } from '../server.js';

import fetchProfileData from '../controllers/profiles/fetch-profile-data-controller.js'
import fetchProfileEvents from '../controllers/profiles/fetch-profile-events-controller.js'
import fetchProfileFollowing from '../controllers/profiles/fetch-profile-following-controller.js'
import fetchProfileFollowers from '../controllers/profiles/fetch-profile-following-controller.js'
//import other necessary middlewares and controllrs here

const profileRouter = Router();

//TODO: add middlewares, controllers, and services responsibilities later



profileRouter.get('/profile/:userId', function(req: Request, res: Response) {
    try {
        // Middleware Service
        
        //Controller
        const data = fetchProfileData(req.params.userId);

        res.send(data);
    } catch (error: any) {
        res.send("Error retrieving user data!");
    }
})

profileRouter.get('/profile/:userId/events', /*middleware, controller*/ function(req: Request, res: Response) {
    try {
        // Middleware Services
        const data = fetchProfileEvents(req.params.userId);
        res.send(data);
    } catch (error: any) {
        res.send("Post not found");
    }
    
})
profileRouter.get('/profile/:userId/following', /*middleware, controller*/ function(req: Request, res: Response) {
    try {
        // Middleware Services
        const data = fetchProfileFollowing(req.params.userId);
        res.send(data);
    } catch (error: any) {
        res.send("Followings not found");
    }
})
profileRouter.get('/profile/:userId/followers', /*middleware, controller*/ function(req: Request, res: Response) {
    try {
        // Middleware Services
        const data = fetchProfileFollowers(req.params.userId)
        res.send(data);
    } catch (error: any) {
        res.send("Followers not found");
    }
})


export default profileRouter