import { Request, Response, Router } from 'express';

import fetchProfileData from '../controllers/profiles/fetch-profile-data-controller.ts'
import fetchProfileEvents from '../controllers/profiles/fetch-profile-events-controller.ts'
import fetchProfileFollowing from '../controllers/profiles/fetch-profile-following-controller.ts'
import fetchProfileFollowers from '../controllers/profiles/fetch-profile-followers-controller.ts'
import updateProfileController from '../controllers/profiles/update-profile-controller.ts'
import { authMiddleware } from '../middleware/auth.js'
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

// PUT /api/profile/:userId - Update user profile (requires authentication)
profileRouter.put('/profile/:userId', authMiddleware, async function(req: Request, res: Response) {
    try {
        const userId = req.params.userId;
        const updates = req.body;
        const requestingUserId = (req as any).user.id;

        const data = await updateProfileController(userId, updates, requestingUserId);

        res.json({ success: true, data });
    } catch (error: any) {
        console.log("Error updating user profile!", error);
        
        // Return appropriate status code
        if (error.message.includes("Unauthorized")) {
            res.status(403).json({ success: false, error: error.message });
        } else if (error.message.includes("No updates")) {
            res.status(400).json({ success: false, error: error.message });
        } else {
            res.status(500).json({ success: false, error: error.message });
        }
    }
})


export default profileRouter