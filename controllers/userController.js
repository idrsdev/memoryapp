import asyncHandler from "express-async-handler";

import {
  authenticateUserService,
  createUserService,
  passwordResetEmailService,
  passwordResetService,
  resendAccountActivationLinkService,
  userVerifyService,
} from "../services/userServices.js";

// @desc Register new user
// @route POST /api/user
// @access Public
const registerUser = asyncHandler(async (req, res, next) => {
  const response = await createUserService(req, res);
  return res.status(response.statusCode).json(response.data);
});

// @desc Auth user and get JWT Token
// @route POST /api/user/login
// @access Public
const authUser = asyncHandler(async (req, res, next) => {
  const response = await authenticateUserService(req, res);

  return res.status(response.statusCode).json(response.data);
});

// @desc Verify user
// @route POST /api/user/verify/:email/:token
// @access Public
const verifyUser = asyncHandler(async (req, res, next) => {
  const response = await userVerifyService(req, res);

  return res.status(response.statusCode).json(response.data);
});

// @desc Resend an account activation link to user using email
// @route POST /api/user/resend-activation-link
// @access Public
const resendAccountActivationEmail = asyncHandler(async (req, res, next) => {
  const response = await resendAccountActivationLinkService(req, res);

  return res.status(response.statusCode).json(response.data);
});

// @desc Send user an email along with a link to reset thier password
// @route POST /api/user/reset-password
// @access Public
const resetPasswordEmail = asyncHandler(async (req, res, next) => {
  const response = await passwordResetEmailService(req, res);

  return res.status(response.statusCode).json(response.data);
});

// @desc Reset user password
// @route POST /api/user/reset-password/:userId/:token
// @access Public
const resetPassword = asyncHandler(async (req, res, next) => {
  const response = await passwordResetService(req, res);

  return res.status(response.statusCode).json(response.data);
});

export {
  authUser,
  registerUser,
  verifyUser,
  resetPassword,
  resetPasswordEmail,
  resendAccountActivationEmail,
};
