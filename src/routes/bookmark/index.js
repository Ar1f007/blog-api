const bookmark = require('../../controllers/bookmark');
const middleware = require('../../middleware');

const router = require('express').Router();

router
  .route('/:postId/:userId')
  .get(bookmark.isBookmarked)
  .post(middleware.authenticateUser, bookmark.createBookmark);

module.exports = router;