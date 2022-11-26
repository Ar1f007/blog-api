const router = require('express').Router();
const middleware = require('../../middleware');
const comment = require('../../controllers/comment');

const {
  CreateCommentSchema,
  PostIdSchema,
} = require('../../validations/comment');

router
  .route('/')
  .post(
    middleware.authenticateUser,
    middleware.validate(CreateCommentSchema, 'body'),
    comment.createComment
  );

router
  .route('/:postId')
  .get(middleware.validate(PostIdSchema, 'params'), comment.getAllComments);

module.exports = router;