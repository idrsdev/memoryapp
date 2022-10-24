import Memory from "../models/memoryModel.js";
import Comment from "../models/commentModel.js";
import sharedMemory from "../models/sharedMemoryModel.js";
import likedMemory from "../models/likedMemoryModel.js";

const getMemoriesService = async (req, res) => {
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

  const getMemoriesWithLimitedComments = [
    {
      $match: seacrObject,
    },
    // @desc: Implement $next to find next memories!
    {
      $limit: 10,
    },
    {
      $lookup: {
        from: "comments",
        localField: "user",
        foreignField: "user",
        as: "comments",
      },
    },
    // @desc: Load 2 post related comments with their author info
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
          {
            $sort: { memory: 1 },
          },
          { $limit: 2 }, // @desc: Comments per memory
          {
            $lookup: {
              from: "users",
              localField: "user",
              foreignField: "_id",
              as: "user",
            },
          },
          {
            $unwind: "$user",
          },
          {
            $group: {
              _id: "$_id",
              comment: {
                $first: "$comment",
              },
              user: {
                $first: "$user",
              },
            },
          },
        ],
      },
    },
    // @desc: Calculating total comments for given Memory
    {
      $lookup: {
        from: "comments",
        let: { id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$$id", "$memory"] },
            },
          },
          { $count: "count" },
        ],
        as: "totalComments",
      },
    },
    {
      $addFields: {
        totalComments: {
          $ifNull: [{ $arrayElemAt: ["$totalComments.count", 0] }, 0],
        },
      },
    },
  ];

  const memories = await Memory.aggregate(getMemoriesWithLimitedComments);
  return memories;
};

const getUserMemoriesService = async (req, res) => {
  const offset = Math.abs(req.query.p);
  const page = !offset || offset === 0 ? 1 : offset;

  const limit = 10;

  const memories = await Memory.find({ user: req.user._id })
    .sort({ _id: 1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return { memories, page };
};

const createMemoryService = async (req, res) => {
  const { title, description, tags, images } = req.body;

  const memory = await Memory.create({
    title,
    description,
    tags,
    images,
    user: req.user._id,
  });

  return memory;
};

const deleteMemoryService = async (req, res) => {
  const memoryId = req.params.id;
  const memory = await Memory.findOneAndDelete({ _id: memoryId });

  if (!memory || memory.user.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error("Operation Failed - No Memory found");
  }

  return { message: "success" };
};

const createMemoryCommentService = async (req, res) => {
  const { comment } = req.body;
  const memory = await Memory.findById(req.params.id);

  if (!memory) {
    res.status(404);
    throw new Error("No memory exists with given Id");
  }

  const newComment = await Comment.create({
    comment,
    user: req.user._id,
    memory: req.params.id,
  });
  return newComment;
};

const shareMemoryService = async (req, res) => {
  const memoryId = req.params.id;
  const userId = req.user._id;

  const { tags, description } = req.body;

  const originalMemory = await Memory.findById({ _id: memoryId }).lean();

  if (!originalMemory) {
    throw new Error("No such memory exists");
  }

  const { _id: originalMemoryId, ...originalMemoryCopy } = originalMemory;

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
  return;
};
const likeMemoryService = async (req, res) => {
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
};

export {
  getMemoriesService,
  getUserMemoriesService,
  createMemoryService,
  deleteMemoryService,
  createMemoryCommentService,
  shareMemoryService,
  likeMemoryService,
};
