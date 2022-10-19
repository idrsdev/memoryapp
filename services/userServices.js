import User from "../models/userModel.js";
import Memory from "../models/memoryModel.js";

import { userWithNoPassword } from "../utils/userWithoutPassword.js";
import generateToken from "../utils/generateToken.js";

const createUserService = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("Email alread in use");
  }

  const newUser = await User.create({
    name,
    email,
    password,
  });

  return {
    ...userWithNoPassword(newUser),
    token: generateToken(newUser._id),
  };
};

const authenticateUserService = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    res.status(400);
    throw new Error("Invalid username or password");
  }

  return {
    ...userWithNoPassword(user),
    token: generateToken(user._id),
  };
};

const getUserMemoriesService = async (req, res) => {
  const memories = await Memory.find({ user: req.user._id });
  return memories;
};

export { createUserService, authenticateUserService, getUserMemoriesService };
