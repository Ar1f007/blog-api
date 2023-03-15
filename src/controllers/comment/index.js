const { asyncWrapper, AppError } = require('../../utils');
const Comment = require('../../models/comment');
const { StatusCodes } = require('http-status-codes');
const { ADMIN } = require('../../constants');

/**
 * @desc Add a comment
 * @route POST /api/comments
 * @access Private
 */
const createComment = asyncWrapper(async (req, res) => {
  const user = req?.user;
  const { postId, content } = req.body;

  const userInfo = {
    userId: user.userId,
    username: user.username,
    fullName: user.fullName,
    email: user.email,
    bio: user.bio,
    photo: user.photo,
  };

  const comment = await Comment.create({
    postId: postId,
    user: userInfo,
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
 * @routes GET /api/comments/post/:id
 * @access Public
 */
const getAllComments = asyncWrapper(async (req, res) => {
  const { id: postId } = req.params;

  const comments = await Comment.find({ postId })
    .sort('-createdAt')
    .lean()
    .exec();

  const totalComments = await Comment.countDocuments({ postId });
  res.status(StatusCodes.OK).json({ success: true, comments, totalComments });
});

/**
 * @desc Get single comment by comment ID
 * @routes GET /api/comments/:id
 * @access Public
 */
const getSingleComment = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  const comment = await Comment.findById(id).lean().exec();

  if (!comment) {
    throw new AppError('Comment not found', StatusCodes.BAD_REQUEST);
  }

  res.status(StatusCodes.OK).json({
    success: true,
    comment,
  });
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
  ).exec();

  if (!comment) {
    throw new AppError('No comment found', StatusCodes.BAD_REQUEST);
  }

  res.status(StatusCodes.OK).json({ success: true, comment });
});

/**
 * @desc Delete a comment
 * @route DELETE /api/comments/:commentId
 * @access Private
 */
const deleteComment = asyncWrapper(async (req, res) => {
  const { id: commentId } = req.params;
  const { role, userId } = req.user;

  const comment = await Comment.findById(commentId)
    .lean()
    .select('user')
    .exec();

  if (!comment) {
    throw new AppError('No comment found', StatusCodes.BAD_REQUEST);
  }

  const idMatch = comment.user.userId.toString() === userId;
  const isAdmin = role === ADMIN;

  if (!isAdmin && !idMatch) {
    throw new AppError(
      "You can not delete other's comment",
      StatusCodes.UNAUTHORIZED
    );
  }

  await Comment.findByIdAndDelete(commentId).exec();

  res
    .status(StatusCodes.OK)
    .json({ success: true, message: 'Comment deleted successfully!' });
});

module.exports = {
  createComment,
  deleteComment,
  getAllComments,
  getSingleComment,
  updateComment,
};


