import eventsRouter from "./events";
import profilesRouter from "./profiles";
import messageRouter from "./Messages";
import webpagesRouter from "./webpages";
import { Router } from "express";


export const mainRouter = Router();

//mount all routers to the api path
//these routes will SOLELY be used
//to make API calls from the frontend

mainRouter.use('/api', eventsRouter)
mainRouter.use('/api', profilesRouter)
mainRouter.use('/api', messageRouter)
mainRouter.use('/', webpagesRouter) //webpages will be served from root

export default mainRouter;

