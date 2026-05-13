import { Router } from "express"
import { login, register, refreshAccessToken, logout } from "../controllers/user.controllers.js"

const router = Router();

router.route("/auth/register").post(register)
router.route("/auth/login").post(login)
router.route("/auth/access-token").post(refreshAccessToken)
router.route("/auth/logout").post(logout)


export default router;
