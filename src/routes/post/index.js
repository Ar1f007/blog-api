const post = require('../../controllers/post');
const middleware = require('../../middleware');
const { SlugSchema } = require('../../validations/others');
const PostValidation = require('../../validations/post');
const { UserIdSchema } = require('../../validations/user');

const router = require('express').Router();

router
  .route('/')
  .post(
    middleware.authenticateUser,
    middleware.uploadCoverImage,
    middleware.resizeCoverImage,
    middleware.validate(PostValidation.CreatePostSchema, 'body'),
    post.createPost
  )
  .get(
    middleware.validate(PostValidation.PaginationSchema, 'query'),
    post.getAllPosts
  );

router
  .route('/reactions')
  .post(
    middleware.validate(PostValidation.ReactionSchema, 'body'),
    middleware.authenticateUser,
    post.toggleReact
  );

router
  .route('/:slug')
  .post(
    middleware.authenticateUser,
    middleware.validate(SlugSchema, 'params'),
    middleware.validate(PostValidation.CreatePostSchema, 'body'),
    post.createPost
  )
  .get(middleware.validate(SlugSchema, 'params'), post.getPost)
  .delete(
    middleware.authenticateUser,
    middleware.validate(SlugSchema, 'params'),
    middleware.authenticateUser,
    post.deletePost
  );

router
  .route('/author-posts/:userId')
  .get(
    middleware.validate(UserIdSchema, 'params'),
    middleware.authenticateUser,
    post.getAuthorsPosts
  );

module.exports = router;