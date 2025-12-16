import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware } from '@clerk/express';
import aiRouter from './routes/aiRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import userRouter from './routes/userRoute.js';
const app = express();
const startServer = async () => {
    try {
        await connectCloudinary();
        console.log('✅ Cloudinary connected');
    }
    catch (err) {
        console.error('❌ Cloudinary connection failed:', err);
        process.exit(1);
    }
    app.use(cors());
    app.use(express.json());
    app.use(clerkMiddleware());
    app.get('/', (req, res) => {
        res.send('Server is Live!');
    });
    app.use('/api/ai', aiRouter);
    app.use('/api/user', userRouter);
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
};
startServer();
export default app;
