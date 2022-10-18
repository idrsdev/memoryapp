// Not used anymore
import mongoose from "mongoose";

const sharedMemorySchema = mongoose.Schema({
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

const sharedMemory = mongoose.model("sharedMemory", sharedMemorySchema);
export default sharedMemory;
