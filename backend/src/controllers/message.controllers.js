import { Message } from "../models/message.model.js";
import { Conversation } from "../models/conversation.model.js";

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