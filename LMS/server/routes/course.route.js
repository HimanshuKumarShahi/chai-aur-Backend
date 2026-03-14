import express from "express"
import {createCourse,getCourses} from "../controllers/course.controller.js"
import {isAuthenticate} from "../middleware/auth.middleware.js"

const router = express.Router()

router.post("/create",isAuthenticate,createCourse)
router.get("/all",getCourses)

export default router