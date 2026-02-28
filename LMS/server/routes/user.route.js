import express from 'express'
import { registerUser,loginUser, logoutUser, Dashboard} from '../controllers/user.controller.js'
import { isAuthenticate } from '../middleware/auth.middleware.js';
const router=express.Router();


// post/api/auth/register
router.post('/register',registerUser)
// post/api/auth/login
router.post('/login',loginUser)

router.post('/logout',logoutUser)

router.get('/user',isAuthenticate,Dashboard)

export default router;