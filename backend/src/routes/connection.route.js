import { Router } from "express"
import { 
    sendConnectionRequest, 
    updateConnectionRequest } from "../controllers/connection.controllers.js"
import { verifyAccessToken } from "../middlewares/verifyAccessToken.middleware.js"

const router = Router()

router.route("/connection/send-connection-request").post(verifyAccessToken,sendConnectionRequest);



export default router