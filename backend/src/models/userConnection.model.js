import mongoose from "mongoose";

const userConnectionSchema =
  new mongoose.Schema(
    {

      users: [
        {
          type:
            mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        }
      ],


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
  { users: 1 },
  { unique: true }
);

export const UserConnection =
  mongoose.model(
    "UserConnection",
    userConnectionSchema
  );