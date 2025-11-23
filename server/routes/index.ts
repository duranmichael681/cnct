import postsRouter from "./posts";
import userRouter from "./users";
import messageRouter from "./Messages";
import webpagesRouter from "./webpages";
import { Router } from "express";


export const mainRouter = Router();

//mount all routers to the api path
//these routes will SOLELY be used
//to make API calls from the frontend

mainRouter.use('/api', postsRouter)
mainRouter.use('/api', userRouter)
mainRouter.use('/api', messageRouter)
mainRouter.use('/', webpagesRouter) //webpages will be served from root

export default mainRouter;

