import express, { json } from "express"
import cookieParser from "cookie-parser";


import userRoutes from "./routes/auth.route.js"

const app = express();

app.use(express.urlencoded({extended: true}))
app.use(json())
app.use(cookieParser())


app.use("/api/v1/",userRoutes)


export { app }



