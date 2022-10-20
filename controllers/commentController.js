import asyncHandler from "express-async-handler";

import {
  deleteCommentService,
  getPaginatedMemoryCommentsService,
} from "../services/commentServices.js";

// @desc get Comments
// @route GET /api/comment
// @access Private/Auth
const getComments = asyncHandler(async (req, res, next) => {
  const comments = await getPaginatedMemoryCommentsService(req, res);

  return res.status(201).json(comments);
});

// @desc delete Comments
// @route GET /api/comment/:id
// @access Private/Auth
const delteleComment = asyncHandler(async (req, res, next) => {
  const comment = await deleteCommentService(req, res);
  return res.status(204).json(comment);
});

export { getComments, delteleComment };
