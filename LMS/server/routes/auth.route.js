import express from "express"

import {
registerUser,
loginUser,
logoutUser,
forgotPassword
} from "../controllers/auth.controller.js"

const router = express.Router()

router.post("/register",registerUser)
router.post("/login",loginUser)
router.get("/logout",logoutUser)
router.post("/forgot",forgotPassword)

export default router