
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

        const existingConnection = await UserConnection.findOne({
            $or: [{
                sender: userId,
                receiver: friendRequestUserId
            },
            {
                sender: friendRequestUserId,
                receiver: userId
            }]
        });

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
            sender: userId,
            receiver: friendRequestUserId,
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
        io.to(friendRequestUserId).emit("new_notification", notification);

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

export async function getIncomingConnectionRequests(req, res) {
    try {
        const { id: userId } = req.user;

        const incomingRequest = await UserConnection.find({
            receiver: userId,
            status: "pending"
        })
            .populate("sender", "_id username email")
            .sort({ createdAt: -1 });

        return res.status(200)
            .json({
                success: true,
                count: incomingRequest.length,
                data: incomingRequest
            });

    } catch (error) {
        console.error("Get Incoming Connection Requests Controller Error: " + error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}


export async function updateConnectionRequest(req, res) {
    try {
        const { id: userId } = req.user;
        const { senderId, status } = req.body;

        // Allowed statuses
        const allowedStatus = ["accepted", "rejected", "blocked"];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status."
            });
        }

        // Find exact connection request
        const existingConnection = await UserConnection.findOne({
            sender: senderId,
            receiver: userId,
            status: "pending"
        });

        if (!existingConnection) {
            return res.status(404).json({
                success: false,
                message: "Connection request not found."
            });
        }

        // Update status
        existingConnection.status = status;
        await existingConnection.save();

        // receiver details
        const receiverDetails = await User.findById(userId);

        let notificationType = "";
        let notificationText = "";

        if (status === "accepted") {
            notificationType = "connection_accepted";
            notificationText = `${receiverDetails.username} accepted your connection request`;
        }

        if (status === "rejected") {
            notificationType = "connection_request";
            notificationText = `${receiverDetails.username} rejected your connection request`;
        }

        // create notification
        const notification = await Notification.create({
            user: senderId, // sender gets notification
            sender: userId,
            connectionId: existingConnection._id,
            type: notificationType,
            text: notificationText
        });

        // realtime socket notification
        io.to(senderId).emit(
            "new_notification",
            notification
        );

        return res.status(200).json({
            success: true,
            message: `Connection request ${status}.`,
            data: existingConnection
        });

    } catch (error) {
        console.error("Update Connection Request Controller Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error."
        });
    }
}

// Returns all Accepted Connection with user do we did not have any conversation;
export async function getAcceptedConnectionsWithoutConversation(req, res) {
    try {
        const { id: userId } = req.user;

        const getAllConnection = await UserConnection.find({
            $or: [
                { sender: userId },
                { receiver: userId },
            ],
            status: "accepted"
        })
            .populate("sender", "username email avatar")
            .populate("receiver", "username email avatar");


        // filter out only other user details should be sent 
        const connectedUsers = getAllConnection.map((connection) => {

            const otherUser =
                connection.sender._id.toString() === userId
                    ? connection.receiver
                    : connection.sender;

            return {
                _id: otherUser._id,
                username: otherUser.username,
                email: otherUser.email,
                avatar: otherUser.avatar,
                connectionId: connection._id,
                connectedAt: connection.createdAt
            };
        });


        res.status(200).json({
            success: true,
            data : connectedUsers
        })

    } catch (error) {
        console.error("Get Accepted Connections Withoud Conversation Controller Error: " + error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error!"
        })
    }

}