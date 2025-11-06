import eventsRouter from "./events";
import userRouter from "./users";
import messageRouter from "./Messages";
import webpagesRouter from "./webpages";
import { Router } from "express";
import { app } from "../server.js"


export const router = Router();

//mount all routers to the api path
//these routes will SOLELY be used
//to make API calls from the frontend

router.use('/api', eventsRouter)
router.use('/api', userRouter)
router.use('/api', messageRouter)
router.use('/', webpagesRouter) //webpages will be served from root

app.use(router);

export default router;

