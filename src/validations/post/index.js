const { CreatePostSchema } = require('./create-post');
const ReactionSchema = require('./reaction');
const { ReactSchema } = require('./toggle-react');

module.exports = { CreatePostSchema, ReactSchema, ReactionSchema };