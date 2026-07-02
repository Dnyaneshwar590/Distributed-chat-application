import { Router } from "express"
import { 
    sendConnectionRequest, 
    getIncomingConnectionRequests,
    updateConnectionRequest,
    getAcceptedConnectionsWithoutConversation
 } from "../controllers/connection.controllers.js"
import { verifyAccessToken } from "../middlewares/verifyAccessToken.middleware.js"
import { tokenBucket } from "../middlewares/tokenBucket.middleware.js"

const router = Router()

router.route("/connection/send-connection-request").post(verifyAccessToken, tokenBucket, sendConnectionRequest);
router.route("/connection/get-connection-request").get(verifyAccessToken, tokenBucket, getIncomingConnectionRequests);
router.route("/connection/update-connection-request").patch(verifyAccessToken, tokenBucket, updateConnectionRequest);
router.route("/connection/get-accepted-connection-request").get(verifyAccessToken, tokenBucket, getAcceptedConnectionsWithoutConversation);


export default router