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

  // Check virtuals to set below three values
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

  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Comment",
    },
  ],

  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  ],

  sharedByUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  ],

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
