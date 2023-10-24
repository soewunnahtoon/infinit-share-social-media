import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    comment: {
      type: String,
      required: true,
    },
    from: {
      type: String,
      required: true,
    },
    replies: [
      {
        replyId: {
          type: mongoose.Schema.Types.ObjectId,
        },
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        from: {
          type: String,
        },
        comment: {
          type: String,
        },
        replyAt: {
          type: String,
        },
        created_At: {
          type: Date,
          default: Date.now(),
        },
        updated_At: {
          type: Date,
          default: Date.now(),
        },
        likes: [
          {
            type: String,
          },
        ],
      },
    ],
    likes: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema);

export { Comment };
