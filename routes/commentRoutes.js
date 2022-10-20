import express from "express";
import { isAuthenticated } from "../middleware/authMiddleware.js";

import {
  delteleComment,
  getComments,
} from "../controllers/commentController.js";

const router = express.Router();

router.route("/").get(isAuthenticated, getComments);
router.route("/:id").delete(isAuthenticated, delteleComment);

export default router;
