import express from "express";

import { authUser, registerUser } from "../controllers/userController.js";

import {
  validateAuthCredentials,
  validateNewUser,
} from "../validators/userValidator.js";

const router = express.Router();

router.route("/").post(validateNewUser, registerUser);
router.route("/login").post(validateAuthCredentials, authUser);

export default router;
