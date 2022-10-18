import asyncHandler from "express-async-handler";

import Memory from "../models/memoryModel.js";

// @desc    get Memories and filters based on optional parameters
// @route   Get /api/memory
// @access  Public
const getMemories = asyncHandler(async (req, res) => {
  const { text: searchText, tags } = req.query;

  const targetTags = Array.isArray(tags) ? tags : [];

  const seacrObject = {};

  if (searchText) {
    seacrObject.description = {
      $regex: searchText,
      $options: "i",
    };
  }
  if (targetTags.length > 0) {
    seacrObject.tags = {
      $in: tags,
    };
  }

  const memories = await Memory.find(seacrObject);
  res.send(memories);
});

// @desc    Create a Memory
// @route   POST /api/memory
// @access  Private/Auth
const createMemory = asyncHandler(async (req, res) => {
  const { title, description, tags } = req.body;

  const memory = await Memory.create({
    title,
    description,
    tags,
    user: req.user._id,
  });

  res.status(201).json(memory);
});

export { getMemories, createMemory };
