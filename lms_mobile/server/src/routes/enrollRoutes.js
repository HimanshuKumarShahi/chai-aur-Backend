import express from 'express';
import { enrollCourse } from '../controllers/enrollController.js';
import { requireAuth } from '@clerk/express';

const router = express.Router();

router.post('/', requireAuth(), enrollCourse);

export default router;