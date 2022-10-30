import express from "express";

import {
  authUser,
  registerUser,
  verifyUser,
} from "../controllers/userController.js";

import {
  validateAuthCredentials,
  validateNewUser,
} from "../validators/userValidator.js";

const router = express.Router();

router.route("/").post(validateNewUser, registerUser);
router.route("/login").post(validateAuthCredentials, authUser);
router.route("/verify/:email/:token").get(verifyUser);

export default router;
