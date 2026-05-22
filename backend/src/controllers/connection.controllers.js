import mongoose from "mongoose";
import { UserConnection } from "../models/userConnection.model.js";
import { User } from "../models/user.model.js"
import { Notification } from "../models/notification.model.js";
import { io } from "../socket.js"

export async function sendConnectionRequest(req, res) {

    try {
        const { id: userId } = req.user;
        const { friendRequestUserId } = req.body;

        if (userId === friendRequestUserId) {
            return res.status(400).json({
                success: false,
                message: "You Cannot Send Request To Yourself"
            })
        }

        const users = [
            new mongoose.Types.ObjectId(userId),
            new mongoose.Types.ObjectId(friendRequestUserId)
        ].sort();

        const existingConnection = await UserConnection.findOne({ users })

        if (existingConnection) {
            // check if sender is blocked 
            if (existingConnection.status === "blocked") {
                return res.status(403).json({
                    success: false,
                    message: "User is blocked."
                });
            }

            // check if friend already exist 
            if (existingConnection.status === "accepted") {
                return res.status(400).json({
                    success: false,
                    message: "Already connected."
                });
            }

            // check for request is already send or not
            if (existingConnection.status === "pending") {
                return res.status(400).json({
                    success: false,
                    message: "Request already pending."
                });
            }
        }


        const connection = await UserConnection.create({
            users,
            requestedBy: userId,
            status: "pending"
        });


        const sendersDetails = await User.findById(userId)
        let message = `${sendersDetails.username} send Connection Request`;

        const notification = new Notification({
            user: friendRequestUserId,
            sender: userId,
            connectionId: connection._id,
            type: "connection_request",
            text: message
        })
        await notification.save();

        // for real time communication 
        io.to(friendRequestUserId).emit(
            "new_notification",
            notification
        );

        // return response
        return res.status(201).json({
            success: true,
            message: "Connection request sent.",
            connection
        });

    } catch (error) {
        console.error("Send Connection Request Controller Error: " + error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error."
        })

    }

}


export async function updateConnectionRequest(req,res){
    try {
        const { id : userId } = req.user;
        
        
    } catch (error) {
        console.error("Update Connection Request Controller Error: "+ error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error."
        })
        
    }
}