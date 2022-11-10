// const { Post } = require('../../models');
const { asyncWrapper } = require('../../utils');

const createPost = asyncWrapper(async (req, res) => {
  // const post = await Post.create(req.body);
  const post = req.body;
  res.json({ post });
});

module.exports = { createPost };