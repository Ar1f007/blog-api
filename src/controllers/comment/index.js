const { asyncWrapper, AppError } = require('../../utils');
const Comment = require('../../models/comment');
const { StatusCodes } = require('http-status-codes');

/**
 * @desc Add a comment
 * @route POST /api/comments
 * @access Private
 */
const createComment = asyncWrapper(async (req, res) => {
  const { userId, fullName } = req.user;
  const { postId, content } = req.body;

  const user = {
    userId,
    fullName,
  };

  const comment = await Comment.create({
    post: postId,
    user,
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
  const { id: postId } = req.params;

  const comments = await Comment.find({ post: postId })
    .sort('-createdAt')
    .exec();
  const totalComments = await Comment.countDocuments({ post: postId });

  res.status(StatusCodes.OK).json({ success: true, comments, totalComments });
});

/**
 * @desc Edit a comment
 * @route Patch /api/comments/update/:commentId
 * @access Private
 */
const updateComment = asyncWrapper(async (req, res) => {
  const { id: commentId } = req.params;
  const { content } = req.body;

  const comment = await Comment.findByIdAndUpdate(
    commentId,
    {
      commentDesc: content,
    },
    {
      new: true,
    }
  );

  if (!comment) {
    throw new AppError('No comment found', StatusCodes.BAD_REQUEST);
  }

  res.status(StatusCodes.OK).json({ success: true, comment });
});

module.exports = { createComment, getAllComments, updateComment };