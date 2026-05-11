// models/message.model.js

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    content: {
      type: String,
      trim: true
    },

    messageType: {
      type: String,
      enum: ["text", "image", "video", "file"],
      default: "text"
    },

    mediaUrl: {
      type: String,
      default: ""
    },

    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    isEdited: {
      type: Boolean,
      default: false
    },

    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export const Message = mongoose.model("Message", messageSchema);