import express from "express";

import {
  authUser,
  registerUser,
  resendAccountActivationEmail,
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
router.route("/resend-activation-link").post(resendAccountActivationEmail);

export default router;
