const post = require('../../controllers/post');
const middleware = require('../../middlewares');
const PostValidation = require('../../validations/post');

const router = require('express').Router();

router
  .route('/')
  .post(
    middleware.validate(PostValidation.CreatePostSchema, 'body'),
    middleware.authenticateUser,
    post.createPost
  );

module.exports = router;