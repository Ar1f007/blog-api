const bookmark = require('../../controllers/bookmark');

const router = require('express').Router();

router.route('/:postId/:userId').get(bookmark.isBookmarked);

module.exports = router;