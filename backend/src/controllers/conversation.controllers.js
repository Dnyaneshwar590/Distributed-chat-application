import { Conversation } from "../models/conversation.model.js";
import { UserConnection } from "../models/userConnection.model.js";


export async function createConversation(req, res) {

  try {

    const currentUserId = req.user.id;

    const { participantId } = req.body;

    /* Prevent self chat */
    if (currentUserId === participantId) {
      return res.status(400).json({
        success: false,
        message: "You cannot chat with yourself"
      });
    }

    // check if user are Connected/Friends or not
    const acceptedConnReq = await UserConnection.findOne({
      $or: [
        {
          sender: currentUserId,
          receiver: participantId,
        },
        {
          sender: participantId,
          receiver: currentUserId,
        }
      ]
    })

    if (!acceptedConnReq || acceptedConnReq.status !== "accepted") {
      return res.status(401).json({
        success: false,
        message: "You Cannot Send Message."
      })
    }

    /* Check existing conversation */
    const existingConversation =
      await Conversation.findOne({
        isGroup: false,
        participants: {
          $all: [
            currentUserId,
            participantId
          ]
        }
      });

    if (existingConversation) {
      return res.status(200).json({
        success: true,
        message: "Conversation already exists",
        data: existingConversation
      });
    }

    //  Create conversation
    const conversation =
      await Conversation.create({
        isGroup: false,
        participants: [
          currentUserId,
          participantId
        ]
      });

    return res.status(201).json({
      success: true,
      message: "Conversation created",
      data: conversation
    });

  } catch (error) {

    console.error("Create Conversation Controller Error:" + error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });

  }
};


export async function getConversation(req, res) {
  try {
    const currentUserId = req.user.id;

    // receiver user id from params
    const { receiverId } = req.params;

    // Find private conversation between two users
    // if isGroup is false and participants has only 2 entries then it's private conversation.
    const currentUsersConversation = await Conversation.findOne({
      isGroup: false,
      participants: {
        $all: [currentUserId, receiverId]
      },
      $expr: {
        $eq: [{ $size: "$participants" }, 2]
      }
    })
      .populate("participants", "username avatar")
      .populate("lastMessage");



    // If conversation does not exist
    if (!currentUsersConversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found!"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Conversation fetched successfully.",
      conversation: currentUsersConversation
    });

  } catch (error) {
    console.error("Get Conversation Controller Error: " + error.message);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error."
    });
  }
}

export async function getUserConversation(req, res) {

  try {
    const { id: userId } = req.user;

    const validConnectionReq = await UserConnection.find({
      status: "accepted",
      $or: [
        { sender: userId },
        { receiver: userId }
      ]
    })

    const connectedUserIds = validConnectionReq.map((connection) => {
      return connection.sender.toString() === userId
        ? connection.receiver
        : connection.sender;
    });


    const conversations = await Conversation.find({
      $and: [
        { participants: userId },
        { participants: { $in: connectedUserIds } }
      ]
    })
      .populate(
        "participants",
        "fullName username"
      )
      .populate("lastMessage","content sender messageType mediaUrl")
      .select("-admins -groupName");


      res.status(200).json({
        success: true,
        data: conversations
      })
      

  } catch (error) {
    console.error("Get User Conversation Controller Error: " + error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error."
    })
  }
}