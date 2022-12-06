import express from "express";

import {
  resetPassword,
  resetPasswordEmail,
} from "../controllers/passwordResetController.js";

const router = express.Router();

router.route("/").post(resetPasswordEmail);
router.route("/:userId/:token").post(resetPassword);

export default router;
