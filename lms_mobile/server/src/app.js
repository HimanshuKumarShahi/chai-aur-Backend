import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';

import courseRoutes from './routes/courseRoutes.js';
import userRoutes from './routes/userRoutes.js';
import enrollRoutes from './routes/enrollRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/enroll', enrollRoutes);

export default app;