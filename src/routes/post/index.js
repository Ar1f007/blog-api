const post = require('../../controllers/post');
const middleware = require('../../middlewares');
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
  );

module.exports = router;