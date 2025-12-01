import { Request, Response, Router } from 'express';

import fetchProfileData from '../controllers/profiles/fetch-profile-data-controller.ts'
import fetchProfileEvents from '../controllers/profiles/fetch-profile-events-controller.ts'
import fetchProfileFollowing from '../controllers/profiles/fetch-profile-following-controller.ts'
import fetchProfileFollowers from '../controllers/profiles/fetch-profile-followers-controller.ts'
//import other necessary middlewares and controllrs here

const profileRouter = Router();

//TODO: add middlewares, controllers, and services responsibilities later



profileRouter.get('/profile/:userId', async function(req: Request, res: Response) {
    try {
        // Middleware Service
        
        //Controller
        const data = await fetchProfileData(req.params.userId);

        res.json({ success: true, data });
    } catch (error: any) {
        console.log("Error fetching user profile!", error);
        res.status(500).json({ success: false, error: error.message });
    }
})

profileRouter.get('/profile/:userId/posts', /*middleware, controller*/ async function(req: Request, res: Response) {
    try {
        // Middleware Services

        //Controller
        const data = await fetchProfileEvents(req.params.userId);

        res.json({ success: true, data });
    } catch (error: any) {
        console.log("Error fetching user posts!", error);
        res.status(500).json({ success: false, error: error.message });
    }
    
})
profileRouter.get('/profile/:userId/following', /*middleware, controller*/ async function(req: Request, res: Response) {
    try {
        // Middleware Services

        //Controller
        const data = await fetchProfileFollowing(req.params.userId);

        res.json({ success: true, data });
    } catch (error: any) {
        console.log("Error fetching user follwings!", error);
        res.status(500).json({ success: false, error: error.message });
    }
})
profileRouter.get('/profile/:userId/followers', /*middleware, controller*/ async function(req: Request, res: Response) {
    try {
        // Middleware Services

        //Controller
        const data = await fetchProfileFollowers(req.params.userId)
        
        res.json({ success: true, data });
    } catch (error: any) {
        console.log("Error fetching user followers!", error);
        res.status(500).json({ success: false, error: error.message });
    }
})


export default profileRouter