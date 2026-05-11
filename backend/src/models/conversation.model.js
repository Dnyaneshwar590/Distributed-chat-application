// models/conversation.model.js

import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    isGroup: {
      type: Boolean,
      default: false
    },

    groupName: {
      type: String,
      default: ""
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message"
    }
  },
  {
    timestamps: true
  }
);

export const Conversation = mongoose.model(
  "Conversation",
  conversationSchema
);