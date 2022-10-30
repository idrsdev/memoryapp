import mongoose, { now } from "mongoose";

const tokenSchema = mongoose.Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  token: { type: String, required: true },
  expireAt: { type: Date, default: Date.now },
  // createdAt: { type: Date, expires: "15m", default: Date.now, index: true },
});

tokenSchema.index({ expireAt: 1 }, { expireAfterSeconds: 60 * 15 });
const Token = mongoose.model("Token", tokenSchema);
export default Token;
