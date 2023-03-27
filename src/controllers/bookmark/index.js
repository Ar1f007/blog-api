const { StatusCodes } = require('http-status-codes');
const Bookmark = require('../../models/bookmark');
const { asyncWrapper, AppError } = require('../../utils');

/**
 * @desc Create Bookmark
 * @routes POST /api/bookmarks/:postId/:userId
 * @access Private
 */
const createOrRemoveBookmark = asyncWrapper(async (req, res) => {
  const { userId, postId } = req.params;

  const authenticateUser = req.user;

  if (authenticateUser.userId !== userId) {
    throw new AppError(
      'You can not perform this action',
      StatusCodes.FORBIDDEN
    );
  }

  const query = { userId, postId };

  const docExists = await Bookmark.findOne(query);

  if (docExists) {
    const removedDoc = await Bookmark.findByIdAndDelete(docExists._id);

    if (!removedDoc) {
      throw new AppError(
        'Could not perform the action',
        StatusCodes.EXPECTATION_FAILED
      );
    }

    return res
      .status(StatusCodes.OK)
      .json({ success: true, bookmark: removedDoc, isBookmarked: false });
  }

  const doc = await Bookmark.create(query);

  if (!doc) {
    throw new AppError(
      'Could not create bookmark',
      StatusCodes.EXPECTATION_FAILED
    );
  }

  return res.status(StatusCodes.CREATED).json({
    success: true,
    bookmark: doc,
    isBookmarked: true,
  });
});

/**
 * @desc Find out if the post is bookmarked or not
 * @routes GET /api/bookmarks/:postId/:userId
 * @access Private
 */
const isBookmarked = asyncWrapper(async (req, res) => {
  const { userId, postId } = req.params;

  const docExists = await Bookmark.findOne({ userId, postId }).lean().exec();

  if (!docExists) {
    return res
      .status(StatusCodes.OK)
      .json({ success: true, isBookmarked: false });
  }

  return res.status(StatusCodes.OK).json({ success: true, isBookmarked: true });
});

module.exports = {
  createOrRemoveBookmark,
  isBookmarked,
};


