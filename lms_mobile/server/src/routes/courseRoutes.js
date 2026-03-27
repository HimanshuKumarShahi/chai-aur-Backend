import express from 'express';
import { createCourse, getCourses } from '../controllers/courseController.js';
import { isAdmin } from '../middleware/auth.js';
import upload from '../utils/multer.js';
import { requireAuth } from '@clerk/express';

const router = express.Router();

router.get('/', getCourses);
router.post('/create', requireAuth(), isAdmin, upload.single('thumbnail'), createCourse);

export default router;