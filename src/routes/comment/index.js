const router = require('express').Router();
const middleware = require('../../middleware');
const comment = require('../../controllers/comment');

const {
  CreateCommentSchema,
  ParamIdSchema,
  CommentContentSchema,
} = require('../../validations/comment');

router
  .route('/')
  .post(
    middleware.authenticateUser,
    middleware.validate(CreateCommentSchema, 'body'),
    comment.createComment
  );

router
  .route('/update/:id')
  .patch(
    middleware.authenticateUser,
    middleware.validate(ParamIdSchema, 'params'),
    middleware.validate(CommentContentSchema, 'body'),
    comment.updateComment
  );

router
  .route('/:id')
  .get(middleware.validate(ParamIdSchema, 'params'), comment.getAllComments)
  .delete(
    middleware.authenticateUser,
    middleware.validate(ParamIdSchema, 'params'),
    comment.deleteComment
  );

module.exports = router;