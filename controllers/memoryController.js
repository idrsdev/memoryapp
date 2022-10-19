import asyncHandler from "express-async-handler";

import Memory from "../models/memoryModel.js";
import Comment from "../models/commentModel.js";
import sharedMemory from "../models/sharedMemoryModel.js";
import likedMemory from "../models/likedMemoryModel.js";

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

  const aggregation = [
    {
      $match: seacrObject,
    },
    {
      $lookup: {
        from: "comments",
        localField: "user",
        foreignField: "user",
        as: "comments",
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "memory",
        as: "comments",
        pipeline: [
          {
            $match: {},
          },
          // { $sort: { createdAt: 1 } },
          { $limit: 2 }, // @desc: Comments per memory
        ],
      },
    },
  ];

  const memories = await Memory.aggregate(aggregation);
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

// @desc    Delte a Memory
// @route   POST /api/memory/:id
// @access  Private/Auth
const deleteMemory = asyncHandler(async (req, res) => {
  const memoryId = req.params.id;

  const memory = await Memory.findById(memoryId);

  if (!memory || memory.user.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error("Operation Failed");
  }

  res.status(204).json({ message: "success" });
});

// @desc    Create a comment for given memory{Id}
// @route   Get /api/memory/{Id}/comment
// @access  Private/Auth
const createMemoryComment = asyncHandler(async (req, res) => {
  const { comment } = req.body;
  const memory = await Memory.findById(req.params.id);

  if (!memory) {
    throw new Error("No memory exists with given Id");
  }

  const newComment = await Comment.create({
    comment,
    user: req.user._id,
    memory: req.params.id,
  });

  res.status(201).json(newComment);
});

// @desc    share Memory
// @route   Get /api/memory/{Id}/share
// @access  Private/Auth
const shareMemory = asyncHandler(async (req, res) => {
  const memoryId = req.params.id;
  const userId = req.user._id;

  const { tags, description } = req.body;

  const originalMemory = await Memory.findById({ _id: memoryId });
  if (!originalMemory) {
    throw new Error("No such memory exists");
  }

  const { _doc: originalMemoryDoc } = originalMemory;
  const { _id: originalMemoryId, ...originalMemoryCopy } = originalMemoryDoc;

  if (Array.isArray(tags) && tags.length > 1) {
    originalMemoryCopy.tags = tags;
  }

  if (description) {
    originalMemoryCopy.description = description;
  }
  originalMemoryCopy.user = req.user._id;
  originalMemoryCopy.sharedFrom = originalMemoryId;

  await Memory.create(originalMemoryCopy);

  await sharedMemory.create({
    user: userId,
    memory: originalMemoryId,
  });

  res.status(200).json({ message: "Memory shared" });
});

// @desc    like a memory
// @route   Get /api/memory/{Id}/like
// @access  Private/Auth
const likeMemory = asyncHandler(async (req, res) => {
  const memoryId = req.params.id;
  const userId = req.user._id;

  const isAlreadyLiked = await likedMemory.findOne({
    memory: memoryId,
    user: userId,
  });

  if (isAlreadyLiked) {
    const unliked = await likedMemory.findOneAndRemove({
      memory: memoryId,
      user: userId,
    });

    res.status(200).json({ message: "unliked sucessfully" });
    return;
  }

  const liked = await likedMemory.create({
    memory: memoryId,
    user: userId,
  });

  if (!liked) {
    throw new Error("Error liking memory");
  }

  res.status(200).json({ message: "Memory Liked successfully" });
});

export {
  getMemories,
  createMemory,
  deleteMemory,
  createMemoryComment,
  shareMemory,
  likeMemory,
};
