import "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Request {
    auth?: () => Promise<{
      userId: string;
      has: (opts: { plan: string }) => Promise<boolean>;
    }>;
    plan?: "free" | "premium";
    free_usage?: number;
    file?: Express.Multer.File;
  }
}
