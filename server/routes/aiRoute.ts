import express, { RequestHandler } from "express";
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

aiRouter.post("/generate-article", auth as RequestHandler, generateArticle as RequestHandler);
aiRouter.post("/generate-blog-title", auth as RequestHandler, generateBlogTitle as RequestHandler);
aiRouter.post("/generate-image", auth as RequestHandler, generateImage as RequestHandler);
aiRouter.post("/remove-image-background", upload.single("image"), auth as RequestHandler, removeImageBackground as RequestHandler);
aiRouter.post("/remove-image-object", upload.single("image"), auth as RequestHandler, removeImageObject as RequestHandler);

export default aiRouter;