import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import { userWithNoPassword } from "../utils/userWithoutPassword.js";
import User from "../models/userModel.js";

import {
  validateNewUser,
  validateAuthCredentials,
} from "../validators/userValidator.js";
import Memory from "../models/memoryModel.js";

// @desc Register new user
// @route POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res, next) => {
  const validationError = validateNewUser(req.body);

  if (validationError) {
    throw new Error(validationError);
  }

  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    return next(new Error("Email alread in use"));
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  return res
    .status(201)
    .json({ ...userWithNoPassword(user), token: generateToken(user._id) });
});

// @desc Auth user and get JWT Token
// @route POST /api/users/login
// @access Public
const authUser = asyncHandler(async (req, res, next) => {
  const isInvalidCredentials = validateAuthCredentials(req.body);

  if (isInvalidCredentials) {
    throw new Error(isInvalidCredentials);
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    res.status(400);
    throw new Error("Invalid username or password");
  }

  return res
    .status(201)
    .json({ ...userWithNoPassword(user), token: generateToken(user._id) });
});

// @desc    get Memories of current user
// @route   Get /api/user/memory
// @access  Private/Auth
const getUserMemories = asyncHandler(async (req, res) => {
  const memories = await Memory.find({ user: req.user._id });

  return res.status(200).json(memories);
});

export { authUser, registerUser, getUserMemories };
