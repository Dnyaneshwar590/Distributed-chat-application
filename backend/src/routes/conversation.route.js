import { Router } from "express"
import { createConversation, getConversation } from "../controllers/conversation.controllers.js"
import { verifyAccessToken } from "../middlewares/verifyAccessToken.middleware.js";

const router = Router();

router.route("/conversation/create-conversation").post(verifyAccessToken, createConversation)
router.route("/conversation/get-conversation/:receiverId").get(verifyAccessToken, getConversation)

export default router;