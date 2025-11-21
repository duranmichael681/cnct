import { Request, Response, Router } from 'express';
import { supabase } from '../server';
import getProfileData from '../controllers/profiles/fetch-profile-data-controller.js'
//import other necessary middlewares and controllrs here

const profileRouter = Router();

//TODO: add middlewares and controllers later

/* !!!!!!NOTE:

This likely is not how you implement routes, and should instead be in controller.
However, I have no reference for any development on the backend other than something I found in Messages.ts,
although I understand that is not where this code should go.

For now, it will be kept here until I can see a reference for controller implementation, and middleware implementation.

*/ 

/*
    TODO: Replace each lambda function with their respective controller.
    The functions can then be put inside the appropriate service.

    Refer to the comment above.
*/


profileRouter.get('/profile/:userId', function(req: Request, res: Response) {
    try {
        // Middleware Service
        
        //Controller
        const data = getProfileData(req.params.userId);

        res.send(data);
    } catch (error: any) {
        res.send("Error retrieving user data!");
    }
})

profileRouter.get('/profile/:userId/events', /*middleware, controller*/ function(req: Request, res: Response) {
    try {
        // Middleware Services
        const {data, error} = supabase
        .from('posts')
        .select()
        .eq("organizer_id", req.params.userId);
        if(error) {
            console.log("Supabase error retrieving post data. Error: ");
            console.log(error);
        }
        res.send(data);
    } catch (error: any) {
        res.send("Post not found");
    }
})
profileRouter.get('/profile/:userId/following', /*middleware, controller*/ function(req: Request, res: Response) {
    try {
        // Middleware Services
        const {data, error} = supabase
        .from('follows')
        .select("followed_user_id")
        .eq("following_user_id", req.params.userId);
        if(error) {
            console.log("Supabase error retrieving following data. Error: ");
            console.log(error);
        }
        res.send(data);
    } catch (error: any) {
        res.send("Followings not found");
    }
})
profileRouter.get('/profile/:userId/followers', /*middleware, controller*/ function(req: Request, res: Response) {
    try {
        // Middleware Services
        const {data, error} = supabase
        .from('follows')
        .select("following_user_id")
        .eq("followed_user_id", req.params.userId);
        if(error) {
            console.log("Supabase error retrieving followers data. Error: ");
            console.log(error);
        }
        res.send(data);
    } catch (error: any) {
        res.send("Followers not found");
    }
})


export default profileRouter