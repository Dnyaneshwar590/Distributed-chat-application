import jwt from "jsonwebtoken";

function getCookieValue(cookieHeader, name) {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export function socketAuthMiddleware(socket, next) {
    try {

        // const token = socket.handshake.headers.cookie.split(" ")[0].split("=")[1].replace(";","");
        const token = getCookieValue(socket.handshake.headers.cookie, "accessToken")
        
        if (!token) {
            return next(
                new Error("Authentication token is required")
            );
        }
        
        const decoded = jwt.verify(token,process.env.SECRET_ACCESS_KEY);
        socket.data.user = { id: decoded.id };

        next();

    } catch (error) {
        console.error("Socket Auth Middleware Error:",error.message);
        next(new Error("Authentication failed"));
    }
}