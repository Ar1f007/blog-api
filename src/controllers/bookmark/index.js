const { StatusCodes } = require('http-status-codes');
const Bookmark = require('../../models/bookmark');
const { asyncWrapper, AppError } = require('../../utils');

/**
 * @desc Create Bookmark
 * @routes POST /api/bookmarks/:userId/:postId
 * @access Private
 */
const createBookmark = asyncWrapper(async (req, res) => {
  const { userId, postId } = req.params;

  const authenticateUser = req.user;

  if (authenticateUser.userId !== userId) {
    throw new AppError(
      'You can not perform this action',
      StatusCodes.FORBIDDEN
    );
  }

  const doc = await Bookmark.create({ userId, postId });

  if (!doc) {
    throw new AppError(
      'Could not create bookmark',
      StatusCodes.EXPECTATION_FAILED
    );
  }

  return res.status(StatusCodes.CREATED).json({
    success: true,
    bookmark: doc,
  });
});

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
  createBookmark,
  isBookmarked,
};


