const reaction = require('../../controllers/reaction');
const middleware = require('../../middleware');

const router = require('express').Router();

router
  .route('/:postId')
  .get(reaction.getTotalReactions)
  .post(middleware.authenticateUser, reaction.addReactionToPost);

router.route('/:postId/:userId').get(reaction.isLiked);

module.exports = router;