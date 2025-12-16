import sql from "../configs/db.js";
import { Request, Response } from "express";

interface AuthRequest extends Request {
  auth: () => Promise<{
    userId: string;
    has: (opts: { plan: string }) => Promise<boolean>;
  }>;
}

interface Creation {
  id: number;
  user_id: string;
  prompt: string;
  content: string;
  type: string;
  publish?: boolean;
  likes?: string[];
  created_at: Date;
}

interface ToggleLikeBody {
  id: number;
}

export const getUserCreations = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { userId } = await req.auth();
    const creations = await sql`
      SELECT * FROM creations 
      WHERE user_id = ${userId} 
      ORDER BY created_at DESC
    ` as Creation[];
    return res.json({ success: true, creations });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return res.json({ success: false, message: errorMessage });
  }
};

export const getPublishedCreations = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const creations = await sql`
      SELECT * FROM creations 
      WHERE publish = true 
      ORDER BY created_at DESC
    ` as Creation[];
    return res.json({ success: true, creations });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return res.json({ success: false, message: errorMessage });
  }
};

export const toggleLikeCreations = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { userId } = await req.auth();
    const { id } = req.body as ToggleLikeBody;

    const [creation] = await sql`
      SELECT * FROM creations WHERE id = ${id}
    ` as Creation[];

    if (!creation) {
      return res.json({ success: false, message: "Creation not found" });
    }

    const currentLikes = creation.likes || [];
    const userIdStr = userId.toString();
    let updatedLikes: string[];
    let message: string;

    if (currentLikes.includes(userIdStr)) {
      updatedLikes = currentLikes.filter((user) => user !== userIdStr);
      message = "Creation unliked";
    } else {
      updatedLikes = [...currentLikes, userIdStr];
      message = "Creation liked";
    }

    const formattedArray = `{${updatedLikes.join(",")}}`; // ✅ Fixed: Added backticks

    await sql`
      UPDATE creations 
      SET likes = ${formattedArray}::text[] 
      WHERE id = ${id}
    `;

    const [updatedCreation] = await sql`
      SELECT * FROM creations WHERE id = ${id}
    ` as Creation[];

    return res.json({
      success: true,
      message,
      likes: updatedCreation.likes || [],
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return res.json({ success: false, message: errorMessage });
  }
};