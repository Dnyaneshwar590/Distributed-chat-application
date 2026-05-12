import { Router } from "express"
import { login, register, refreshAccessToken } from "../controllers/user.controllers.js"

const router = Router();

router.route("/auth/register").post(register)
router.route("/auth/login").post(login)
router.route("/auth/access-token").post(refreshAccessToken)


export default router;
