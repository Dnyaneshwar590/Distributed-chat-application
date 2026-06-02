import jwt from "jsonwebtoken"

export function verifyAccessToken(req, res, next) {

    try {
        const accessToken = req.cookies?.accessToken
        // check for access token 
        if (!accessToken) {
            return res.status(401).json({
                success: false,
                message: "Access token not found. Unauthorized access."
            });
        }

        // decode the access token
        const decodedToken = jwt.verify(
            String(accessToken),
            process.env.SECRET_ACCESS_KEY,
        )

        req.user = {
            id: decodedToken.id,
            username: decodedToken.username,
            email: decodedToken.email,
        }

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired access token."
        });
    }

}