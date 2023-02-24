const { CreatePostSchema } = require('./create-post');
const PaginationSchema = require('./get-posts');
const ReactionSchema = require('./reaction');
const { ReactSchema } = require('./toggle-react');

module.exports = {
  CreatePostSchema,
  ReactSchema,
  ReactionSchema,
  PaginationSchema,
};