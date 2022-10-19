import express from "express";
const router = express.Router();
import {
  authUser,
  getUserMemories,
  registerUser,
} from "../controllers/userController.js";

import { isAuthenticated } from "../middleware/authMiddleware.js";

router.route("/").post(registerUser);
router.route("/memory").get(isAuthenticated, getUserMemories);
router.route("/login").post(authUser);

export default router;
