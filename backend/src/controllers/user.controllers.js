import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { User } from "../models/user.model.js"
import { Session } from "../models/session.model.js"
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js"


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

export async function login(req,res) {

    try {
        const { username, password } = req.body;

        // check if user sent all data or not
        if(!username || !password){
            return res.status(400).json({
                success : false,
                message : "All fields are required!"
            })
        }

        // check if user exist or not 
        const existingUser = await User.findOne({username})
        if(!existingUser){
            return res.status(404).json({
                success: false,
                message: "User Not Found Please Register!"
            })
        }

        // check if password match or not
        const isPasswordMatch = await bcrypt.compare(String(password),String(existingUser.password))
        if(!isPasswordMatch){
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials Please Provide the Valid User Name or Password"
            })
        }


        // Set the JWT TOKEN in IN Cookies
        const access_token = generateAccessToken(existingUser)
        const refresh_token = generateRefreshToken(existingUser)


        // Store Refreshtoken in Session model
        const session = new Session({
            user: existingUser._id,
            refreshToken: refresh_token
        })

        await session.save();

        res.cookie("accessToken", access_token,{
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        })
        res.cookie("refreshToken", refresh_token,{
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.json({
            success: true,
            message: "Login Successfull",
            data: {
                id : existingUser._id,
                email: existingUser.email,
            }
        })

        
    } catch (error) {
        console.error("Login Controller Error: "+error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
    
}


export async function refreshAccessToken(req, res) {

    try {

        // Get refresh token from cookies
        const refreshToken = req.cookies.refreshToken;

        // Check if token exists
        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token missing"
            });
        }

        // Verify refresh token
        const decoded = jwt.verify(
            refreshToken,
            process.env.SECRET_REFRESH_KEY
        );

        // Check if session exists in DB
        const existingSession = await Session.findOne({
            refreshToken
        });

        if (!existingSession) {
            return res.status(401).json({
                success: false,
                message: "Invalid session"
            });
        }

        // Generate new access token
        const newAccessToken = generateAccessToken({
            _id: decoded.id,
            username: decoded.username
        });

        // Send new access token in cookie
        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: "Access token refreshed"
        });

    } catch (error) {

        console.error(
            "Refresh Token Controller Error:",
            error.message
        );

        return res.status(401).json({
            success: false,
            message: "Invalid or expired refresh token"
        });
    }
}