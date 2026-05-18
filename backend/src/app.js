import express, { json } from "express"
import cookieParser from "cookie-parser";


import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import conversationRoutes from "./routes/conversation.route.js"

const app = express();

app.use(express.urlencoded({extended: true}))
app.use(json())
app.use(cookieParser())


app.use("/api/v1/",authRoutes)
app.use("/api/v1",userRoutes)
app.use("/api/v1",conversationRoutes)


export { app }



