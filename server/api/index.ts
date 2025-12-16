import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware } from '@clerk/express';
import aiRouter from '../routes/aiRoute.js';
import connectCloudinary from '../configs/cloudinary.js';
import userRouter from '../routes/userRoute.js';

const app = express();

connectCloudinary();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.get('/', (req: Request, res: Response) => {
  res.send('Server is Live!');
});

app.use('/api/ai', aiRouter);
app.use('/api/user', userRouter);

export default app; 