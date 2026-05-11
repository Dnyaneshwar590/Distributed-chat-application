import mongoose from "mongoose";

const socketSessionSchema = new mongoose.Schema({
  
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  socketId: {
    type: String,
    required: true
  },

  connectedAt: {
    type: Date,
    default: Date.now
  }

});

export const SocketSession = mongoose.model(
  "SocketSession",
  socketSessionSchema
);