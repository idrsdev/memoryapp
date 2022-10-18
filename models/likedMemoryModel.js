import mongoose from "mongoose";

const likedMemorySchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  memory: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Memory",
  },
});

const likedMemory = mongoose.model("likedMemory", likedMemorySchema);
export default likedMemory;
