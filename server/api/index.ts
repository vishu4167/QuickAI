import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import { clerkMiddleware } from "@clerk/express";

import aiRouter from "../routes/aiRoute.js";
import userRouter from "../routes/userRoute.js";
import connectCloudinary from "../configs/cloudinary.js";

const app = express();

connectCloudinary();


app.use(
  cors({
    origin: true,              
    credentials: true,         
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());


app.use(express.json());

app.use(clerkMiddleware());


app.get("/", (req: Request, res: Response) => {
  res.send("Server is Live!");
});

app.use("/api/ai", aiRouter);
app.use("/api/user", userRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});

export default app;
