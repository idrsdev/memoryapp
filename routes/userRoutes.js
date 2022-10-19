import express from "express";

import {
  authUser,
  getUserMemories,
  registerUser,
} from "../controllers/userController.js";

import { isAuthenticated } from "../middleware/authMiddleware.js";

import {
  validateAuthCredentials,
  validateNewUser,
} from "../validators/userValidator.js";

const router = express.Router();

router.route("/").post(validateNewUser, registerUser);
router.route("/memory").get(isAuthenticated, getUserMemories);
router.route("/login").post(validateAuthCredentials, authUser);

export default router;
