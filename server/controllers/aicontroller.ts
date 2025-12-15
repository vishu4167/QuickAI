import OpenAI from "openai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import { Request, Response } from "express";

interface AuthRequest extends Request {
  auth: () => Promise<{
    userId: string;
    has: (opts: { plan: string }) => Promise<boolean>;
  }>;
  plan?: "free" | "premium";
  free_usage?: number;
  file?: Express.Multer.File;
}

interface GenerateArticleBody {
  prompt: string;
  length: number;
}

interface GenerateBlogTitleBody {
  prompt: string;
}

interface GenerateImageBody {
  prompt: string;
  publish?: boolean;
}

interface RemoveImageObjectBody {
  object: string;
}

const AI = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});


export const generateArticle = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { userId } = await req.auth();
    const { prompt, length } = req.body as GenerateArticleBody;
    const plan = req.plan;
    const free_usage = req.free_usage || 0;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached. Upgrade to continue.",
      });
    }

    const response = await AI.chat.completions.create({
      model: "gpt-4o-mini", 
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: length,
    });

    const content = response.choices[0].message.content;

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${content}, 'article')
    `;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: { free_usage: free_usage + 1 },
      });
    }

    return res.json({ success: true, content });
  } catch (error: any) {
    console.error("ARTICLE ERROR:", error?.response?.data || error);

    return res.status(500).json({
      success: false,
      message: "Article generation failed",
    });
  }
};


export const generateBlogTitle = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { userId } = await req.auth();
    const { prompt } = req.body as GenerateBlogTitleBody;
    const plan = req.plan;
    const free_usage = req.free_usage || 0;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached. Upgrade to continue.",
      });
    }

    const response = await AI.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Generate 5 catchy SEO-friendly blog titles.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 120,
    });

    const content = response.choices[0].message.content;

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${content}, 'blog-title')
    `;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: { free_usage: free_usage + 1 },
      });
    }

    return res.json({ success: true, content });
  } catch (error: any) {
    console.error("BLOG TITLE ERROR:", error?.response?.data || error);

    return res.status(500).json({
      success: false,
      message: "Blog title generation failed",
    });
  }
};

export const generateImage = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { userId } = await req.auth();
    const { prompt, publish } = req.body as GenerateImageBody;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscription.",
      });
    }

    const formData = new FormData();
    formData.append("prompt", prompt);

    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: { "x-api-key": process.env.CLIPDROP_API_KEY as string },
        responseType: "arraybuffer",
      }
    );

    const base64Image = `data:image/png;base64,${Buffer.from(
      data,
      "binary"
    ).toString("base64")}`;

    const { secure_url } = await cloudinary.uploader.upload(base64Image);

    await sql`INSERT INTO creations (user_id, prompt, content, type, publish)
    VALUES(${userId}, ${prompt}, ${base64Image}, 'image', ${publish ?? false})`;

    return res.json({ success: true, content: secure_url });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.log(errorMessage);
    return res.json({ success: false, message: errorMessage });
  }
};

export const removeImageBackground = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { userId } = await req.auth();
    const image = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscription.",
      });
    }

    if (!image) {
      return res.json({
        success: false,
        message: "No image file provided.",
      });
    }

    const { secure_url } = await cloudinary.uploader.upload(image.path, {
      transformation: [
        {
          effect: "background_removal",
          background_removal: "remove_the_background",
        },
      ],
    });

    await sql`INSERT INTO creations (user_id, prompt, content, type)
    VALUES(${userId}, 'Remove background from image', ${secure_url}, 'image')`;

    return res.json({ success: true, content: secure_url });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.log(errorMessage);
    return res.json({ success: false, message: errorMessage });
  }
};

export const removeImageObject = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { userId } = await req.auth();
    const { object } = req.body as RemoveImageObjectBody;
    const image = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscription.",
      });
    }

    if (!image) {
      return res.json({
        success: false,
        message: "No image file provided.",
      });
    }

    const { public_id } = await cloudinary.uploader.upload(image.path);

    const imageUrl = cloudinary.url(public_id, {
      transformation: [{ effect: `gen_remove:${object}` }],
      resource_type: "image",
    });

    await sql`INSERT INTO creations (user_id, prompt, content, type)
    VALUES (${userId}, ${`Removed ${object} from image`}, ${imageUrl}, 'image')`;

    return res.json({ success: true, content: imageUrl });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.log(errorMessage);
    return res.json({ success: false, message: errorMessage });
  }
};