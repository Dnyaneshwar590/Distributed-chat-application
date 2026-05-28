import { Router } from "express"
import { login, register, refreshAccessToken, logout } from "../controllers/auth.controllers.js"
import { verifyAccessToken } from "../middlewares/verifyAccessToken.middleware.js"
import { tokenBucket } from "../middlewares/tokenBucket.middleware.js"

const router = Router();

router.route("/auth/register").post(tokenBucket, register)
router.route("/auth/login").post(tokenBucket, login)
router.route("/auth/access-token").post(refreshAccessToken)
router.route("/auth/logout").post(logout)



export default router;
