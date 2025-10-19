import { Router } from "express";

//this router will handle
//directing users to the
//correct webpages.

//right now there are no webpages
//that we could update to the 
//server. This will be useful 
//in the future when we know 
//we will have to use it.

export const webpagesRouter = Router();

webpagesRouter.get('/', /*Middleware, Controller*/)

export default webpagesRouter;