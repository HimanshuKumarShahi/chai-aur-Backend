import express from 'express';
import { syncUser } from '../controllers/UserController.js';
import { requireAuth } from '@clerk/express';

const router = express.Router();

router.get('/sync', requireAuth(), syncUser);

export default router;