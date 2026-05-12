import jwt from "jsonwebtoken"


export function generateAccessToken(payload) {
    return jwt.sign({
        id: payload._id,
        email: payload.email,
        username: payload.username
    },
        process.env.SECRET_ACCESS_KEY,
        {
            expiresIn: process.env.SECRET_ACCESS_EXPIRY
        }
    )
}


export function generateRefreshToken(payload) {
    return jwt.sign({
        id: payload._id,
    },
        process.env.SECRET_REFRESH_KEY,
        {
            expiresIn: process.env.SECRET_REFRESH_EXPIRY
        }
    )
}