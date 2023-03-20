const { StatusCodes } = require('http-status-codes');
const Reaction = require('../../models/reaction');
const { asyncWrapper } = require('../../utils');

/**
 * @desc Get number of reactions for a post
 * @routes GET /api/reactions/:postId
 * @access Public
 */
const getTotalReactions = asyncWrapper(async (req, res) => {
  const { postId } = req.params;
  const totalReactions = await Reaction.countDocuments({ postId }).exec();

  return res.status(StatusCodes.OK).json({ success: true, totalReactions });
});

const addReactionToPost = asyncWrapper(async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.user;

  const reactionRes = await Reaction.create({ userId, postId });

  res.status(StatusCodes.OK).json({
    success: true,
    reactionRes,
  });
});

module.exports = {
  getTotalReactions,
  addReactionToPost,
};