const { asyncWrapper, AppError } = require('../../utils');
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
    .select({ name: 1, slug: 1, id: 1 })
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

/**
 * @desc Delete a category
 * @routes GET /api/categories/:id
 * @access Private
 */
const deleteCategory = asyncWrapper(async (req, res) => {
  const id = req.params;

  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    throw new AppError('Category does not exist', StatusCodes.NOT_FOUND);
  }

  res.status(StatusCodes.OK).json({
    success: true,
    category,
    message: 'Category deleted successfully',
  });
});

module.exports = {
  getAllCategories,
  deleteCategory,
};