import { Message } from "../models/message.model.js";
import { Conversation } from "../models/conversation.model.js";
import { io } from "../socket.js"

export async function createMessage(req, res) {

    try {

        const { conversationId } = req.params; //conversation if from conversation model
        const { id: sender } = req.user; // logged In user id sender
        const { content } = req.body; // message

        // validate content
        const trimmedContent =
            content?.trim();

        if (!trimmedContent) {
            return res.status(400).json({
                success: false,
                message: "Message content required"
            });
        }


        // check for existing conversation does exist or not
        const existingConversation =
            await Conversation.findById(
                conversationId
            );

        if (!existingConversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation does not exist"
            });
        }

        //Check sender belongs to conversation
        const isParticipant =
            existingConversation.participants
                .includes(sender);

        if (!isParticipant) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access"
            });
        }

        //Create message
        const newMessage =
            await Message.create({
                conversationId,
                sender,
                content: trimmedContent,
                readBy: [sender] // initially sender has seed the message first so we also store senders
            });

        // Update last message
        existingConversation.lastMessage = newMessage._id;
        await existingConversation.save();

        //Populate sender details
        const populatedMessage = await Message.findById(newMessage._id)
            .populate(
                "sender",
                "username email");

        // REAL TIME COMMUNICATION
        io.to(conversationId).emit(
            "new_message",
            populatedMessage
        );

        return res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: populatedMessage
        });

    } catch (error) {

        console.error(
            "Create Message Error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

}

export async function getMessage(req, res) {

    try {

        const { conversationId } = req.params;
        const limit = Number(req.query.limit) || 20;
        const { cursor } = req.query;

        // Check conversation exists
        const existingConversation = await Conversation.findById(conversationId);

        if (!existingConversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation Not Found."
            });
        }

        // Query object
        const query = { conversationId };

        // Cursor pagination Fetch older messages
        if (cursor) {
            query._id = {
                $lt: cursor
            };
        }

        // Fetch messages
        const messages = await Message.find(query)
            .populate(
                "sender",
                "username email"
            )
            .sort({
                _id: -1
            })
            .limit(limit);

        // Next cursor
        const nextCursor = messages.length === limit ?
            messages[messages.length - 1]._id :
            null;

        const formattedMessages = messages.reverse();

        return res.status(200).json({
            success: true,
            data: formattedMessages,
            nextCursor,
            hasMore: Boolean(nextCursor)
        });

    } catch (error) {

        console.error("Get Message Controller Error:", error.message);
        return res.status(500).json({
            success: false,
            message:
                "Internal Server Error"
        });

    }

}

// Controller Functino to Read Message
export async function readMessage(req, res) {
    try {

        // if the message in not readed and only 
        // and that message can ready by login and valid user
        const { conversationId } = req.params;
        const { id: userId } = req.user;


        const existingConversation = await Conversation.findById(conversationId);
        if (!existingConversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation Not Found."
            });
        }

        // check for participente
        const isParticipant = existingConversation.participants.includes(userId)
        if (!isParticipant) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access"
            });
        }

        // update all message 
        await Message.updateMany({
            conversationId,
            sender: { $ne: userId }, // $ne means not equal and sender is not current user 
            readBy: { $ne: userId }  // readBy has not readed the message
        },
            {
                $push: { readBy: userId } // append a specific value at the end of an array
            });

        io.to(conversationId).emit("messages_read", {
            conversationId,
            userId
        });

        res.status(200).json({
            success: true,
            message: "Message mark as read"
        })

    } catch (error) {
        console.error("Read Message Controller Error: " + error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error."
        })
    }
}