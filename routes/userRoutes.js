import express from "express";

import {
  authUser,
  registerUser,
  resendAccountActivationEmail,
  resetPassword,
  resetPasswordEmail,
  verifyUser,
} from "../controllers/userController.js";

import {
  validateNewUser,
  validateAuthCredentials,
} from "../validators/userValidator.js";

const router = express.Router();

router.route("/").post(validateNewUser, registerUser);
router.route("/login").post(validateAuthCredentials, authUser);
router.route("/verify/:email/:token").get(verifyUser);
router.route("/reset-password").post(resetPasswordEmail);
router.route("/reset-password/:userId/:token").post(resetPassword);
router.route("/resend-activation-link").post(resendAccountActivationEmail);

export default router;
