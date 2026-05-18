import { Router } from "express";
import { verifyAccessToken } from "../middlewares/verifyAccessToken.middleware.js"
import { fetchUserDetails } from "../controllers/user.controllers.js"

const router = Router();


router.route("/user/profile-details").get(verifyAccessToken,fetchUserDetails)


export default router;