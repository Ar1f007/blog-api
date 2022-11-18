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
  .route('/:slug')
  .patch(
    middleware.validate(SlugSchema, 'params'),
    middleware.validate(PostValidation.ReactSchema, 'body'),
    middleware.authenticateUser,
    post.toggleReact
  );

module.exports = router;