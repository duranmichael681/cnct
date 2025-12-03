import postsRouter from "./posts.ts";
import profilesRouter from "./profiles.ts";
import messageRouter from "./Messages.ts";
import webpagesRouter from "./webpages.ts";
import storageRouter from "./storage.js";
import usersRouter from "./users.js";
import notificationsRouter from "./notifications.js";
import tagsRouter from "./tags.js";
import groupsRouter from "./groups.js";
import commentsRouter from "./comments.js";
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
mainRouter.use('/api/groups', groupsRouter)
mainRouter.use('/api/comments', commentsRouter)
mainRouter.use('/', webpagesRouter) //webpages will be served from root

export default mainRouter;