const { asyncWrapper } = require('../../utils');
const Category = require('../../models/category');
const { StatusCodes } = require('http-status-codes');

/**
 * @desc Get all categories
 * @routes GET /api/categories/
 * @access Public
 */
const getAllCategories = asyncWrapper(async (req, res) => {
  const categories = await Category.find()
    .sort('-createdAt')
    .select('-createdAt')
    .exec();

  // const c = await Category.aggregate([
  //   {
  //     $lookup: {
  //       from: 'posts',
  //       localField: '_id',
  //       foreignField: 'category',
  //       as: 'posts',
  //     },
  //   },
  //   {
  //     $group: {
  //       _id: '$name',
  //       count: {
  //         $sum: {
  //           $size: '$posts',
  //         },
  //       },
  //     },
  //   },
  //   {
  //     $sort: { count: -1 },
  //   },
  // ]);

  res.status(StatusCodes.OK).json({ success: true, categories });
});

module.exports = {
  getAllCategories,
};