import {Router} from "express";
import { loginUser, registerUser,logoutUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }   
    ]),
    registerUser)

 router.route("/login").post(loginUser)


    //secure routes
router.post('/logout', verifyJWT, logoutUser)

export default router