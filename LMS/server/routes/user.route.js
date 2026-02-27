import express from 'express'
import { registerUser,loginUser} from '../controllers/user.controller.js'

const router=express.Router();

// post/api/auth/register

router.post('/register',registerUser)
router.post('/loginUser',loginUser)

export default router;