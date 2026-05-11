import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js"


export async function register(req,res){
    try {
        
        // take user credentials
        const {username, password, email} = req.body

        // check if user sent all data or not
        if(!username || !password || !email){
            return res.status(400).json({
                success : false,
                message : "All fields are required!"
            })
        }

        // check if user already exist or not
        // ".exists()"" returns object with "_id" if at least one document exist in db with given filter 
        const existingUser = await User.exists({
            $or : [{email},{username}]
        })

        console.log("Existing User: "+existingUser._id);
        if(existingUser){
            return res.status(409).json({
                success: false,
                message: "User Already Exist!!"
            })
        }

        // encrypt our password
        const hashPassword = await bcrypt.hash(String(password),10);

        // create new User and save
        const newUser = new User({
            username, email,
            password : hashPassword
        })
        await newUser.save();

        // send successfull message as response
        res.status(201).json({
            success: true,
            message: "Registration Successfull",
            data: {
                id : newUser._id,
                email: newUser.email
            }
        })
        
    } catch (error) {
        res.status(500).json({
            success : false,
            message: "Internal Server Error."
        })
    }
}