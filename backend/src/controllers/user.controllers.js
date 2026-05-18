
import { User } from "../models/user.model.js";

export async function fetchUserDetails(req,res) {

    try {
        // Get the Login User Details.
        const { id } = req.user;

        const user = await User.findById({
            _id: id
        })
        
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User Not Found",
            })
        }

        res.status(200).json({
            success: true,
            data: user
        })
        
        
    } catch (error) {
        console.error("Fetch User Details Controller Error: "+ error.message);
        res.status(500).json({
            success: false, 
            message: "Internal Server Error"
        })
        
    }
    
}