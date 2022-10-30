import asyncHandler from "express-async-handler";

import {
  authenticateUserService,
  createUserService,
  userVerifyService,
} from "../services/userServices.js";

// @desc Register new user
// @route POST /api/user
// @access Public
const registerUser = asyncHandler(async (req, res, next) => {
  const response = await createUserService(req, res);

  return res.status(response.statusCode).json({ message: response.message });
});

// @desc Auth user and get JWT Token
// @route POST /api/user/login
// @access Public
const authUser = asyncHandler(async (req, res, next) => {
  const user = await authenticateUserService(req, res);

  return res.status(200).json(user);
});

// @desc Verify user
// @route POST /api/user/verify/:email/:token
// @access Public
const verifyUser = asyncHandler(async (req, res, next) => {
  const response = await userVerifyService(req, res);

  return res.status(200).json(response);
});

export { authUser, registerUser, verifyUser };
