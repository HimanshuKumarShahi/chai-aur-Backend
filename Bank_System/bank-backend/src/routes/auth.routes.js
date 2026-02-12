import { Router } from "express";
import { 
    register, 
    login, 
    me, 
    changePassword, 
    setPin 
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(register)
router.route("/login").post(login)

// Protected routes
router.route("/me").get(verifyJWT, me)
router.route("/change-password").post(verifyJWT, changePassword)
router.route("/set-pin").post(verifyJWT, setPin)

export default router