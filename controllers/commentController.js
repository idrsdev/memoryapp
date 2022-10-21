import asyncHandler from "express-async-handler";

import {
  deleteCommentService,
  getPaginatedMemoryCommentsService,
  getCursorBasedMemoryCommentsService,
} from "../services/commentServices.js";

// @desc get Comments
// @route GET /api/comment
// @access Private/Auth
const getComments = asyncHandler(async (req, res, next) => {
  let paginationMethod = req.query.paginationMethod;

  const allowedPaginatedMethods = {
    cursorBased: "cursorBased",
    offsetBased: "offsetBased",
  };

  if (!(paginationMethod in allowedPaginatedMethods)) {
    paginationMethod = null;
  }

  const comments =
    paginationMethod === "cursorBased"
      ? await getCursorBasedMemoryCommentsService(req, res)
      : await getPaginatedMemoryCommentsService(req, res);

  return res.status(200).json(comments);
});

// @desc delete Comments
// @route GET /api/comment/:id
// @access Private/Auth
const delteleComment = asyncHandler(async (req, res, next) => {
  const comment = await deleteCommentService(req, res);
  return res.status(204).json(comment);
});

export { getComments, delteleComment };
