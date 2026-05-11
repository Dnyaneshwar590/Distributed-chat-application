import { server } from "./socket.js";
import dotenv from "dotenv"
import { dbConnect } from "./db/index.js";

dotenv.config({
    path: "./.env"
})
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