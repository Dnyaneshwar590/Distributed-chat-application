import express, { json } from "express"
import cookieParser from "cookie-parser";
import cors from "cors";


// Routes
import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import conversationRoutes from "./routes/conversation.route.js"
import messageRoutes from "./routes/message.route.js"
import connectionRoutes from "./routes/connection.route.js"

const app = express();

app.use(express.urlencoded({extended: true}))
app.use(json())
app.use(cookieParser())

app.use(cors({
    origin : process.env.CLIENT_URL || "http://localhost:5173",
    methods : ['GET','POST','DELETE','PUT'],
    // allowedHeaders : [
    //     'Content-Type',
    //     'Authorization',
    //     'Cache-Control',
    //     'Expires',
    //     'Pragma'
    // ],
    credentials : true
}))


app.use("/api/v1/",authRoutes)
app.use("/api/v1",userRoutes)
app.use("/api/v1",conversationRoutes)
app.use("/api/v1",messageRoutes)
app.use("/api/v1",connectionRoutes)

export { app }



