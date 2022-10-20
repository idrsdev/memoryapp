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

  const loadMore = page * commentsPerPage < totalComment ? true : null;

  return { totalComment, comments, commentsPerPage, loadMore };
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

export { getPaginatedMemoryCommentsService, deleteCommentService };
