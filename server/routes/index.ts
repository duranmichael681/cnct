import eventsRouter from "./events.js";
import userRouter from "./users.js";
import messageRouter from "./Messages.js";
import webpagesRouter from "./webpages.js";
import { Router } from "express";


export const mainRouter = Router();

//mount all routers to the api path
//these routes will SOLELY be used
//to make API calls from the frontend

mainRouter.use('/api', eventsRouter)
mainRouter.use('/api', userRouter)
mainRouter.use('/api', messageRouter)
mainRouter.use('/', webpagesRouter) //webpages will be served from root

export default mainRouter;

