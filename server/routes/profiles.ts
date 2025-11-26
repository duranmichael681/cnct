import { Request, Response, Router } from 'express';

import fetchProfileData from '../controllers/profiles/fetch-profile-data-controller.js'
import fetchProfileEvents from '../controllers/profiles/fetch-profile-events-controller.js'
import fetchProfileFollowing from '../controllers/profiles/fetch-profile-following-controller.js'
import fetchProfileFollowers from '../controllers/profiles/fetch-profile-following-controller.js'
//import other necessary middlewares and controllrs here

const profileRouter = Router();

//TODO: add middlewares, controllers, and services responsibilities later



profileRouter.get('/profile/:userId', async function(req: Request, res: Response) {
    try {
        // Middleware Service
        
        //Controller
        const data = await fetchProfileData(req.params.userId);

        res.send(data);
    } catch (error: any) {
        res.send("Error retrieving user data!");
    }
})

profileRouter.get('/profile/:userId/posts', /*middleware, controller*/ async function(req: Request, res: Response) {
    try {
        // Middleware Services

        //Controller
        const data = await fetchProfileEvents(req.params.userId);

        res.send(data);
    } catch (error: any) {
        res.send("Posts not found");
    }
    
})
profileRouter.get('/profile/:userId/following', /*middleware, controller*/ async function(req: Request, res: Response) {
    try {
        // Middleware Services

        //Controller
        const data = await fetchProfileFollowing(req.params.userId);

        res.send(data);
    } catch (error: any) {
        res.send("Followings not found");
    }
})
profileRouter.get('/profile/:userId/followers', /*middleware, controller*/ async function(req: Request, res: Response) {
    try {
        // Middleware Services

        //Controller
        const data = await fetchProfileFollowers(req.params.userId)
        
        res.send(data);
    } catch (error: any) {
        res.send("Followers not found");
    }
})


export default profileRouter