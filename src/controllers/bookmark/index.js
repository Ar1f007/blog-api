const { StatusCodes } = require('http-status-codes');
const Bookmark = require('../../models/bookmark');
const { asyncWrapper } = require('../../utils');

/**
 * @desc Find out if the post is bookmarked or not
 * @routes GET /api/bookmarks/:userId/:postId
 * @access Private
 */
const isBookmarked = asyncWrapper(async (req, res) => {
  const { userId, postId } = req.params;

  const docExists = await Bookmark.findOne({ userId, postId }).lean().exec();

  if (!docExists) {
    return res
      .status(StatusCodes.CONTINUE)
      .json({ success: true, isBookmarked: false });
  }

  return res.status(StatusCodes.OK).json({ success: true, isBookmarked: true });
});

module.exports = {
  isBookmarked,
};


