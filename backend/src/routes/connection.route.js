import { Router } from "express"
import { 
    sendConnectionRequest, 
    getIncomingConnectionRequests,
    updateConnectionRequest
 } from "../controllers/connection.controllers.js"
import { verifyAccessToken } from "../middlewares/verifyAccessToken.middleware.js"

const router = Router()

router.route("/connection/send-connection-request").post(verifyAccessToken,sendConnectionRequest);
router.route("/connection/get-connection-request").get(verifyAccessToken,getIncomingConnectionRequests);
router.route("/connection/update-connection-request").patch(verifyAccessToken,updateConnectionRequest);




export default router