
import { Router } from "express"
import { createMessage } from "../controllers/message.controllers.js"
import { verifyAccessToken } from "../middlewares/verifyAccessToken.middleware.js"

const router = Router();

router.route("/message/create-message/:conversationId").post(verifyAccessToken, createMessage)



export default router;
