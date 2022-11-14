const { StatusCodes } = require('http-status-codes');

const { asyncWrapper, slugify } = require('../../utils');
const { getCategoryId, getTagIds } = require('./util');
const { Post } = require('../../models');

/**
 * @desc Add a new post
 * @route POST /api/posts
 * @access Private
 */
const createPost = asyncWrapper(async (req, res) => {
  const {
    category: categoryName,
    tags,
    title,
    published_at,
    description,
    authorId,
  } = req.body;

  const slugTitle = slugify(title);

  const categoryId = await getCategoryId(categoryName);

  const tagIds = await getTagIds(tags);

  const postData = {
    title,
    authorId,
    description,
    published_at,
    category: categoryId,
    slug: slugTitle,
    tags: tagIds,
  };

  const post = await Post.create(postData);

  res.status(StatusCodes.CREATED).json({ success: true, post });
});

module.exports = { createPost };