import mongoose from "mongoose";

const FriendRequestSchema = new mongoose.Schema(
  {
    requestTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    requestFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    requestStatus: {
      type: String,
      default: "Pending",
    },
  },
  { timestamps: true }
);

const FriendRequest = mongoose.model("FriendRequest", FriendRequestSchema);

export { FriendRequest };
