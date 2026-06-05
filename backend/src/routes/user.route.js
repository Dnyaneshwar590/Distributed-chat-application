import { Router } from "express";
import { verifyAccessToken } from "../middlewares/verifyAccessToken.middleware.js"
import { fetchUserDetails, fetchAllUsers } from "../controllers/user.controllers.js"

const router = Router();

router.route("/user/profile-details").get(verifyAccessToken,fetchUserDetails)
router.route("/user/all-user").get(verifyAccessToken,fetchAllUsers)


export default router;