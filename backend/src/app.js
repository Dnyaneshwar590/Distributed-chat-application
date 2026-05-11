import express, { json } from "express"


import userRoutes from "./routes/user.route.js"

const app = express();

app.use(express.urlencoded({extended: true}))
app.use(json())


app.use("/api/v1/",userRoutes)


export { app }



