import jwt from "jsonwebtoken";

export function socketAuthMiddleware(socket, next) {
    try {

        const token = socket.handshake.headers.cookie.split(" ")[1].split("=")[1];

        if (!token) {
            return next(
                new Error("Authentication token is required")
            );
        }

        const decoded = jwt.verify(token,process.env.SECRET_ACCESS_KEY);

        socket.user = { id: decoded.id };

        next();

    } catch (error) {
        console.error("Socket Auth Middleware Error:",error.message);
        next(new Error("Authentication failed"));
    }
}