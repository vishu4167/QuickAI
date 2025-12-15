import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware } from '@clerk/express';

const app = express();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.get('/', (req: Request, res: Response) => {
  res.send('Server is Live!');
});

app.get('/api/test', (req: Request, res: Response) => {
  res.json({ message: 'API is working!' });
});

export default app;