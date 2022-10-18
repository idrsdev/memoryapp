import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
  comment: { type: String, required: true },
  isReply: { type: Boolean, default: false },

  memory: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    default: null,
    ref: "Memory",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    default: null,
    ref: "User",
  },
  replies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      default: [],
      ref: "Comment",
    },
  ],
});

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
