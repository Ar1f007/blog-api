const { StatusCodes } = require('http-status-codes');
const Reaction = require('../../models/reaction');
const { asyncWrapper, AppError } = require('../../utils');

/**
 * @desc Get number of reactions for a post
 * @routes GET /api/reactions/:postId
 * @access Public
 */
const getTotalReactions = asyncWrapper(async (req, res) => {
  const { postId } = req.params;
  const totalReactions = await Reaction.countDocuments({ postId }).exec();

  if (!totalReactions) {
    throw new AppError('No post found', StatusCodes.BAD_REQUEST);
  }

  return res.status(StatusCodes.OK).json({ success: true, totalReactions });
});

module.exports = {
  getTotalReactions,
};