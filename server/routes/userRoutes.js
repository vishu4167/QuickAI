import express from "express";
import { requireAuth } from "@clerk/express";
import { getUserCreations, getPublishedCreations, toggleLikeCreations } from "../controllers/userController.js";
const userRouter = express.Router();
userRouter.get('/get-user-creations',requireAuth(),getUserCreations)
userRouter.get('/get-published-creations',getPublishedCreations)
userRouter.post('/toggle-like-creations',requireAuth,toggleLikeCreations)

export default userRouter;
