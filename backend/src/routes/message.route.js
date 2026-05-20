
import { Router } from "express"
import { createMessage , getMessage} from "../controllers/message.controllers.js"
import { verifyAccessToken } from "../middlewares/verifyAccessToken.middleware.js"

const router = Router();

router.route("/message/create-message/:conversationId").post(verifyAccessToken, createMessage)
router.route("/message/get-message/:conversationId").get(verifyAccessToken, getMessage)




export default router;
