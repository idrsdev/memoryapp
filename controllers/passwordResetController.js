import asyncHandler from "express-async-handler";

import {
  passwordResetEmailService,
  passwordResetService,
} from "../services/passwordResetServices.js";

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

export { resetPassword, resetPasswordEmail };
