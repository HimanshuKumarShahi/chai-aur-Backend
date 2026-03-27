import express from 'express';
import { syncUser } from '../controllers/UserController.js';
import { requireAuth } from '@clerk/express';

const router = express.Router();

// CORRECTED: Changed from .get to .post
router.post('/sync', requireAuth(), syncUser);

export default router;