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

const isLiked = asyncWrapper(async (req, res) => {
  const { postId, userId } = req.params;
  if (!postId || !userId)
    return res.status(StatusCodes.OK).json({ success: false, isLiked: false });

  const exists = await Reaction.findOne({ postId, userId }).lean().exec();

  if (!exists) {
    return res.status(StatusCodes.OK).json({ success: true, isLiked: false });
  }
  return res.status(StatusCodes.OK).json({ success: true, isLiked: true });
});

module.exports = {
  getTotalReactions,
  addReactionToPost,
  isLiked,
};