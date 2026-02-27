import express from 'express'
import { registerUser,loginUser} from '../controllers/user.controller.js'

const router=express.Router();


// post/api/auth/register
router.post('/register',registerUser)
// post/api/auth/login
router.post('/login',loginUser)

export default router;