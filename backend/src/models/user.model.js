// models/user.model.js

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },

    avatar: {
      type: String,
      default: ""
    },

    isOnline: {
      type: Boolean,
      default: false
    },

    lastSeen: {
      type: Date,
      default: Date.now
    },

    socketId: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);