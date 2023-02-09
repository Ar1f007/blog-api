const { asyncWrapper } = require('../../utils');
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

module.exports = {
  getAllTags,
};