import asyncHandler from "express-async-handler";

import {
  authenticateUserService,
  createUserService,
  getUserMemoriesService,
} from "../services/userServices.js";

// @desc Register new user
// @route POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res, next) => {
  const user = await createUserService(req, res);

  return res.status(201).json(user);
});

// @desc Auth user and get JWT Token
// @route POST /api/users/login
// @access Public
const authUser = asyncHandler(async (req, res, next) => {
  const user = await authenticateUserService(req, res);

  return res.status(200).json(user);
});

// @desc    get Memories of current user
// @route   Get /api/user/memory
// @access  Private/Auth
const getUserMemories = asyncHandler(async (req, res) => {
  const memories = await getUserMemoriesService(req, res);

  return res.status(200).json(memories);
});

export { authUser, registerUser, getUserMemories };
