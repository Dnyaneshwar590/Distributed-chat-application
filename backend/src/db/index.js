
import mongoose from "mongoose";

export async function dbConnect() {
    try {
        const dbUrl = process.env.DB_URL;
        const dbName = process.env.DB_NAME;
        const connectionInstance = await mongoose.connect(`${dbUrl}/${dbName}`);
        console.log(`DB CONNECTION SUCCESSFULL:${connectionInstance.connection.host}`);
        
    } catch (error) {
        console.error("SOMETHING WENT WRONG WHILE CONNECTING TO DATABASE!!!");
        process.exit(1)
    }
    
}