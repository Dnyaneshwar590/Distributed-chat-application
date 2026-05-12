// models/session.model.js

import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    /*
      User who owns this session
    */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    /*
      Store refresh token

      Used to generate new access tokens
    */
    refreshToken: {
      type: String,
      required: true
    },

    /*
      Current active socket connection

      Useful for:
      - real-time chat
      - online users
      - notifications
    */
    socketId: {
      type: String,
      default: null
    },

    /*
      Device information

      Example:
      - Chrome
      - Mobile App
      - Firefox
    */
    device: {
      type: String,
      default: "web"
    },

    /*
      IP address of user
    */
    ipAddress: {
      type: String,
      default: ""
    },

    /*
      Session expiration time
    */
    expiresAt: {
      type: Date,
      // required: true
    },

    /*
      Is session currently active?
    */
    isActive: {
      type: Boolean,
      default: true
    },

    /*
      Last activity timestamp
    */
    lastActivity: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

/*
  Automatically delete expired sessions

  MongoDB TTL Index
*/
sessionSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

export const Session = mongoose.model(
  "Session",
  sessionSchema
);