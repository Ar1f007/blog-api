const { asyncWrapper, AppError } = require('../../utils');
const Comment = require('../../models/comment');
const { StatusCodes } = require('http-status-codes');

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

module.exports = { createComment };