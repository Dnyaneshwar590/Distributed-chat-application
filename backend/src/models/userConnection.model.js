import mongoose from "mongoose";

const userConnectionSchema =
  new mongoose.Schema(
    {

      sender: {type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },

      receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },

      //   for later updates
      status: {
        type: String,

        enum: [
          "pending",
          "accepted",
          "blocked",
          "rejected"
        ],

        default: "pending"
      }

    },
    {
      timestamps: true
    }
  );

/*
  Prevent duplicate connections
*/
userConnectionSchema.index(
  { sender: 1, receiver: 1 },
  { unique: true }
);

export const UserConnection = mongoose.models.UserConnection ||  mongoose.model("UserConnection",userConnectionSchema);