import express from "express";
import { auth } from "../middlewares/auth.js";
import {
  generateArticle,
  generateBlogTitle,
  generateImage,
  removeImageBackground,
  removeImageObject,
} from "../controllers/aicontroller.js";
import { upload } from "../configs/multer.js";

const aiRouter = express.Router();

aiRouter.post("/generate-article", auth as any, generateArticle as any);
aiRouter.post("/generate-blog-title", auth as any, generateBlogTitle as any);
aiRouter.post("/generate-image", auth as any, generateImage as any);
aiRouter.post("/remove-image-background", upload.single("image"), auth as any, removeImageBackground as any);
aiRouter.post("/remove-image-object", upload.single("image"), auth as any, removeImageObject as any);

export default aiRouter;