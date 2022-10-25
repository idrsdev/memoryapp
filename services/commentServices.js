import mongoose from "mongoose";

import Comment from "../models/commentModel.js";

const getPaginatedMemoryCommentsService = async (req, res) => {
  const memoryId = req.query.memoryId;
  const pageNo = Math.abs(req.query.pageNo);
  const limit = Math.abs(req.query.limit);

  const page = !pageNo || pageNo === 0 ? 1 : pageNo;
  const commentsPerPage = !limit || limit === 0 ? 3 : limit;

  const offset = (page - 1) * commentsPerPage;

  const comments = await Comment.find({ memory: memoryId })
    .sort({ _id: 1 })
    .skip(offset)
    .limit(commentsPerPage);

  const totalComment = await Comment.countDocuments({ memory: memoryId });

  const hasMore = page * commentsPerPage < totalComment ? true : null;

  return { totalComment, comments, limit: commentsPerPage, hasMore, page };
};

const deleteCommentService = async (req, res) => {
  const commentId = req.params.id;

  const comment = await Comment.findOneAndDelete({ _id: commentId });

  if (!comment || comment.user.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error("Operation Failed - No Such Comment");
  }

  return { message: "success" };
};

const getCursorBasedMemoryCommentsService = async (req, res) => {
  const memoryId = req.query.memoryId;
  const limit = Number(req.query.limit) || 10;

  const isValidObjectId = req.query.next
    ? mongoose.Types.ObjectId.isValid(req.query.next)
    : null;

  const indexOfLastCommentFetched = isValidObjectId
    ? mongoose.Types.ObjectId(req.query.next)
    : null;

  const startingPoint = {};
  if (indexOfLastCommentFetched) {
    startingPoint["_id"] = { $gt: indexOfLastCommentFetched };
  }

  const getCursorBasedComments = [
    {
      $match: {
        memory: mongoose.Types.ObjectId(memoryId),
        ...(indexOfLastCommentFetched ? startingPoint : {}),
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
    {
      $limit: limit,
    },
  ];

  // @desc: Measure time performance of both approached to find comments
  const comments = await Comment.aggregate(getCursorBasedComments);

  // const comments = await Comment.find({
  //   memory: mongoose.Types.ObjectId(memoryId),
  //   ...(indexOfLastCommentFetched ? startingPoint : {}),
  // })
  //   .sort({ _id: 1 })
  //   .limit(limit);

  // @result: Comparable performance using aggregation and find, limit, sort combo

  const next = comments[comments.length - 1]._id || null;

  return { comments, next };
};

export {
  getPaginatedMemoryCommentsService,
  deleteCommentService,
  getCursorBasedMemoryCommentsService,
};
