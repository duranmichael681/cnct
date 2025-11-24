import postsRouter from "./posts.js";
import profilesRouter from "./profiles.js";
import messageRouter from "./Messages.js";
import webpagesRouter from "./webpages.js";
import storageRouter from "./storage.js";
import usersRouter from "./users.js";
import notificationsRouter from "./notifications.js";
import tagsRouter from "./tags.js";
import { Router } from "express";


export const mainRouter = Router();

//mount all routers to the api path
//these routes will SOLELY be used
//to make API calls from the frontend

mainRouter.use('/api/posts', postsRouter)
mainRouter.use('/api', profilesRouter)
mainRouter.use('/api', messageRouter)
mainRouter.use('/api/storage', storageRouter)
mainRouter.use('/api/users', usersRouter)
mainRouter.use('/api/notifications', notificationsRouter)
mainRouter.use('/api/tags', tagsRouter)
mainRouter.use('/', webpagesRouter) //webpages will be served from root

export default mainRouter;