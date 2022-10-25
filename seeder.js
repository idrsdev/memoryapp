import User from "./models/userModel.js";
import Memory from "./models/memoryModel.js";
import Comment from "./models/commentModel.js";

import connectDB from "./config/db.js";
import dotenv from "dotenv";
import colors from "colors";

import bcrypt from "bcryptjs";

dotenv.config();
connectDB();

// @Warning: proceed with caution

const salt = await bcrypt.genSalt(10);
const password = await bcrypt.hash("changeme", salt);
const user = await User.findOneAndUpdate(
  { email: "john@no-reply.com" },
  {
    email: "john@no-reply.com",
    name: "John",
    password: password,
  },
  { upsert: true }
);
console.log("User Created"); // new ObjectId("63579839631c134514fc483e")

const posts = [];
const comments = [];
const maxPostLimit = 200;
const maxCommentsPerPost = maxPostLimit * 200;

for (let index = 0; index < maxPostLimit; index++) {
  const memory = {
    title: "Modernization of Apps",
    description:
      "Alot of big companies are now moving to cloud, adopting serverless and agile methodologies",
    tags: ["cloud", "modernization", "serverless", "agile"],
    images: [
      "https://image.shutterstock.com/image-photo/surreal-concept-roll-world-dice-260nw-1356798002.jpg,https://image.shutterstock.com/image-photo/surreal-concept-roll-world-dice-260nw-1356798002.jpg",
    ],
    user: user._id,
  };

  posts.push(memory);
}

const newMemoreis = await Memory.insertMany(posts);
console.log("Memories Created");
console.log(newMemoreis[0]._id);

for (let index = 0; index < maxCommentsPerPost; index++) {
  const comment = {
    comment: "The cloud is indeed the future!",
    user: user._id,
    memory: newMemoreis[index % maxPostLimit]._id,
  };

  comments.push(comment);
}

await Comment.insertMany(comments);

console.log("*** Data Seeded succesfully ***");
process.exit(1);
