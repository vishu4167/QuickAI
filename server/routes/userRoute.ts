import express, { RequestHandler } from "express";
import { requireAuth } from "@clerk/express";
import {
  getUserCreations,
  getPublishedCreations,
  toggleLikeCreations,
} from "../controllers/usercontroller.js";

const userRouter = express.Router();

userRouter.get(
  "/get-user-creations",
  requireAuth() as RequestHandler,
  getUserCreations as RequestHandler
);

userRouter.get(
  "/get-published-creations",
  getPublishedCreations as RequestHandler
);

userRouter.post(
  "/toggle-like-creations",
  requireAuth() as RequestHandler,
  toggleLikeCreations as RequestHandler
);

export default userRouter;