const { asyncWrapper, AppError, slugify } = require('../../utils');
const { StatusCodes } = require('http-status-codes');
const Tag = require('../../models/tag');

/**
 * @desc Get all tags
 * @routes GET /api/tags
 * @access Public
 */

const getAllTags = asyncWrapper(async (req, res) => {
  const tags = await Tag.find()
    .sort('-createdAt')
    .select({ name: 1, slug: 1 })
    .exec();

  res.status(StatusCodes.OK).json({ success: true, tags });
});

/**
 * @desc Update a tag
 * @routes PUT /api/tags/:id
 * @access Private
 */
const updateTag = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const slug = slugify(name);

  const tag = await Tag.findByIdAndUpdate(id, { name, slug }, { new: true });

  if (!tag) {
    throw new AppError('Category does not exist', StatusCodes.NOT_FOUND);
  }

  res.status(StatusCodes.OK).json({ success: true, tag: tag });
});

module.exports = {
  getAllTags,
  updateTag,
};