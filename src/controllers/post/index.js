const { StatusCodes } = require('http-status-codes');

const { asyncWrapper, slugify } = require('../../utils');
const { getCategoryId, getTagIds } = require('./util');
const { Post } = require('../../models');
const { uploadCoverImage } = require('./upload-cover-image');

/**
 * @desc Add a new post
 * @route POST /api/posts
 * @access Private
 */
const createPost = asyncWrapper(async (req, res) => {
  let postData = {};

  const { category, tags, title, published_at, description } = req.body;

  const authorId = req.user.userId;

  const url = await uploadCoverImage(req.file.filename);

  const slugTitle = slugify(title);

  postData.authorId = authorId;
  postData.coverImage = url;

  postData.published_at = published_at;
  postData.title = title;
  postData.slug = slugTitle;
  postData.description = description;

  if (category.categoryId) {
    postData.category = category.categoryId;
  }

  if (category.newCategoryName) {
    postData.category = await getCategoryId(category.newCategoryName);
  }

  if (tags.ids) {
    postData.tags = tags.ids;
  }

  if (tags.newTagNames) {
    const newTagIds = await getTagIds(tags.newTagNames);
    if (postData.tags) {
      postData.tags = [...postData.tags, ...newTagIds];
    } else {
      postData.tags = newTagIds;
    }
  }

  const post = await Post.create(postData);

  res.status(StatusCodes.CREATED).json({ success: true, post });
});

module.exports = { createPost };
