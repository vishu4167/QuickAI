import express from "express";
import { requireAuth } from "@clerk/express";
import {
  getUserCreations,
  getPublishedCreations,
  toggleLikeCreations,
} from "../controllers/usercontroller.js";

const userRouter = express.Router();

userRouter.get(
  "/get-user-creations",
  requireAuth() as any,
  getUserCreations as any
);

userRouter.get(
  "/get-published-creations",
  getPublishedCreations as any
);

userRouter.post(
  "/toggle-like-creations",
  requireAuth() as any,
  toggleLikeCreations as any
);

export default userRouter;