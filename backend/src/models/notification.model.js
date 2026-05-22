import mongoose from "mongoose";

const notificationSchema =
  new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },

      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },

      conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        default: null
      },

      connectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserConnection",
        default: null
      },

      type: {
        type: String,

        enum: [
          "message",
          "connection_request",
          "connection_accepted",
          "blocked"
        ],

        required: true
      },

      text: {
        type: String,
        required: true
      },

      isRead: {
        type: Boolean,
        default: false
      }

    },
    {
      timestamps: true
    }
);

export const Notification =
  mongoose.model(
    "Notification",
    notificationSchema
);