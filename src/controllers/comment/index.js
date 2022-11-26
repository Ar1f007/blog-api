const { asyncWrapper, AppError } = require('../../utils');
const Comment = require('../../models/comment');
const { StatusCodes } = require('http-status-codes');

/**
 * @desc Add a comment
 * @route POST /api/comments
 * @access Private
 */
const createComment = asyncWrapper(async (req, res) => {
  const { userId } = req.user;
  const { postId, content } = req.body;

  const comment = await Comment.create({
    post: postId,
    user: userId,
    commentDesc: content,
  });

  if (!comment) {
    throw new AppError('Could not create comment', StatusCodes.CONFLICT);
  }

  res.status(StatusCodes.CREATED).json({
    success: true,
    comment,
  });
});

/**
 * @desc Get all comments of a particular post
 * @routes GET /api/comments/:postId
 * @access Public
 */
const getAllComments = asyncWrapper(async (req, res) => {
  const { postId } = req.params;

  const comments = await Comment.find({ post: postId }).exec();
  const totalComments = await Comment.countDocuments({ post: postId });

  res.status(StatusCodes.OK).json({ success: true, comments, totalComments });
});

module.exports = { createComment, getAllComments };