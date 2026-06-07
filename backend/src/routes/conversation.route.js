import { Router } from "express"
import { 
    createConversation, 
    getConversation, 
    getUserConversation 
} from "../controllers/conversation.controllers.js"
import { verifyAccessToken } from "../middlewares/verifyAccessToken.middleware.js";

const router = Router();

router.route("/conversation/create-conversation").post(verifyAccessToken, createConversation)
router.route("/conversation/get-conversation/:receiverId").get(verifyAccessToken, getConversation)
router.route("/conversation/get-user-conversation").get(verifyAccessToken,getUserConversation)

export default router;