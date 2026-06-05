import dotenv from "dotenv"
dotenv.config({
    path: "./.env"
})
import { server } from "./socket.js";
import { dbConnect } from "./db/index.js";

const PORT = process.env.PORT || 5000

dbConnect()
.then(()=>{
    server.listen(PORT, ()=>{
        console.log(`Server is Running: http://localhost:${PORT}`);
    })
})
.catch((error)=>{
    console.error("DB CONNECTION FAILED:"+error.message);
})