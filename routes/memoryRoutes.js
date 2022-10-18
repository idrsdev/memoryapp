import express from "express";
const router = express.Router();

import { createMemory, getMemories } from "../controllers/memoryController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import { newMemoryValidation } from "../validators/memoryValidator.js";

router.route("/").get(getMemories);
router.route("/").post(isAuthenticated, newMemoryValidation, createMemory);

export default router;
