const { StatusCodes } = require('http-status-codes');
const { Tag, Category, User } = require('../../models');
const { AppError } = require('../../utils');
const { create } = require('./create-doc');

/**
 * @param {string} tagName
 * @returns tag id
 */
const tag = async (tagName) => await create(Tag, tagName);

/**
 *
 * @param {string[]} tags
 * @returns list of tag id
 */
exports.getTagIds = async (tags) => {
  try {
    const ids = await Promise.all(tags.map(tag));

    return ids;
  } catch (error) {
    throw new AppError(error?.message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

/**
 *
 * @param {String} categoryName
 * @return category id
 */
exports.getCategoryId = async (categoryName) => {
  const categoryId = await create(Category, categoryName);

  return categoryId;
};

exports.updatePostCount = async (authorId, value) => {
  await User.findByIdAndUpdate(authorId, {
    $inc: { postCount: value },
  }).exec();
};