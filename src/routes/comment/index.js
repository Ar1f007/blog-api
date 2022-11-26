const router = require('express').Router();
const middleware = require('../../middleware');
const comment = require('../../controllers/comment');

const { CreateCommentSchema } = require('../../validations/comment');

router
  .route('/')
  .post(
    middleware.authenticateUser,
    middleware.validate(CreateCommentSchema, 'body'),
    comment.createComment
  );

module.exports = router;