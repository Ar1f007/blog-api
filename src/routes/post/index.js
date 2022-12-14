const post = require('../../controllers/post');
const middleware = require('../../middleware');
const { SlugSchema } = require('../../validations/others');
const PostValidation = require('../../validations/post');

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
  .get(post.getAllPosts);

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
    middleware.validate(SlugSchema, 'params'),
    middleware.validate(PostValidation.CreatePostSchema, 'body'),
    post.createPost
  )
  .get(middleware.validate(SlugSchema, 'params'), post.getPost)
  .delete(
    middleware.validate(SlugSchema, 'params'),
    middleware.authenticateUser,
    post.deletePost
  );

module.exports = router;