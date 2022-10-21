import asyncHandler from "express-async-handler";

import {
  createMemoryCommentService,
  createMemoryService,
  deleteMemoryService,
  getMemoriesService,
  getUserMemoriesService,
  likeMemoryService,
  shareMemoryService,
} from "../services/memoryServices.js";

// @desc    get Memories, filtered based on optional parameters
// @route   Get /api/memory
// @access  Public
const getMemories = asyncHandler(async (req, res) => {
  const memories = await getMemoriesService(req, res);
  res.status(200).json(memories);
});

// @desc    get Memories of current user
// @route   Get /api/memory/me
// @access  Private/Auth
const getUserMemories = asyncHandler(async (req, res) => {
  const memories = await getUserMemoriesService(req, res);

  return res.status(200).json(memories);
});

// @desc    Create a Memory
// @route   POST /api/memory
// @access  Private/Auth
const createMemory = asyncHandler(async (req, res) => {
  const memory = await createMemoryService(req, res);
  res.status(201).json(memory);
});

// @desc    Delte a Memory
// @route   POST /api/memory/:id
// @access  Private/Auth
const deleteMemory = asyncHandler(async (req, res) => {
  const memory = await deleteMemoryService(req, res);
  res.status(204).json(memory);
});

// @desc    Create a comment for given memory{Id}
// @route   Get /api/memory/{Id}/comment
// @access  Private/Auth
const createMemoryComment = asyncHandler(async (req, res) => {
  const comment = await createMemoryCommentService(req, res);
  res.status(201).json(comment);
});

// @desc    share Memory
// @route   Get /api/memory/{Id}/share
// @access  Private/Auth
const shareMemory = asyncHandler(async (req, res) => {
  await shareMemoryService(req, res);
  res.status(200).json({ message: "Memory shared" });
});

// @desc    like a memory
// @route   Get /api/memory/{Id}/like
// @access  Private/Auth
const likeMemory = asyncHandler(async (req, res) => {
  await likeMemoryService(req, res);
  res.status(200).json({ message: "Memory Liked successfully" });
});

export {
  getMemories,
  getUserMemories,
  createMemory,
  deleteMemory,
  createMemoryComment,
  shareMemory,
  likeMemory,
};
