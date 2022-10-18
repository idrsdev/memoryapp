import mongoose from "mongoose";

const memorySchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tags: [{ type: String }],
  images: [{ type: String }],

  // TODO: Check if a separate counter table can be formed? virtual fields?
  totalShares: {
    type: Number,
    default: 0,
  },

  totalComments: {
    type: Number,
    default: 0,
  },
  totalLikes: {
    type: Number,
    default: 0,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },

  sharedFrom: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: "Memory",
  },
});

const Memory = mongoose.model("Memory", memorySchema);
export default Memory;
