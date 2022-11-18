const { StatusCodes } = require('http-status-codes');

const { asyncWrapper, slugify, AppError } = require('../../utils');
const { getCategoryId, getTagIds } = require('./util');
const { Post } = require('../../models');
const { uploadCoverImage } = require('./upload-cover-image');
const { ADMIN } = require('../../constants');

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

/**
 * @desc Get the list of post which were already published (Date <= Current Time)
 * @route GET /api/posts
 * @access Public
 */
const getAllPosts = asyncWrapper(async (req, res) => {
  const posts = await Post.find({ published_at: { $lte: Date.now() } })
    .lean()
    .exec();

  const postCount = await Post.countDocuments({
    published_at: { $lte: Date.now() },
  }).exec();

  res
    .status(StatusCodes.OK)
    .json({ success: true, posts, totalPosts: postCount });
});

/**
 * @desc Get single post details
 * @route GET /api/posts/:slug
 * @access Public
 */
const getPost = asyncWrapper(async (req, res) => {
  const slug = req.params.slug;

  const post = await Post.find({ slug }).lean().exec();

  if (!post) {
    throw new AppError('No post found', StatusCodes.BAD_REQUEST);
  }

  res.status(StatusCodes.OK).json({ success: true, post });
});

/**
 * @desc Delete post
 * @route /api/posts
 * @access Private
 */
const deletePost = asyncWrapper(async (req, res) => {
  const { userId, role } = req.user;

  const { slug } = req.params;

  const post = await Post.find({ slug }).lean().select('authorId').exec();

  if (role !== ADMIN && userId !== post.authorId) {
    throw new AppError(
      'You are not authorized to perform this task',
      StatusCodes.UNAUTHORIZED
    );
  }

  await Post.deleteOne({ slug });

  res
    .status(StatusCodes.OK)
    .json({ success: true, message: 'Post deleted successfully' });
});

/**
 * @desc Like / Unlike post
 * @route PATCH /api/posts/:slug
 * @access Private
 */
const toggleReact = asyncWrapper(async (req, res) => {
  const { action, postId } = req.body;
  const { userId } = req.user;

  // find the post
  const post = await Post.findById(postId)
    .lean()
    .select('likes likesCount isLiked')
    .exec();

  if (!post) {
    throw new AppError('No post found', StatusCodes.NOT_FOUND);
  }

  // if the user has liked and has not liked before
  if (action.isLiked && !post.isLiked) {
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $inc: { likesCount: 1 },
        $push: { likes: userId },
        isLiked: true,
      },
      { new: true }
    );

    return res
      .status(StatusCodes.OK)
      .json({ success: true, post: updatedPost });
  }

  // user has liked before so pull the id out of the likes array and decrement likes count by 1
  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    {
      $inc: { likesCount: -1 },
      $pull: { likes: userId },
      isLiked: false,
    },
    { new: true }
  );

  return res.status(StatusCodes.OK).json({ success: true, post: updatedPost });
});

module.exports = { createPost, getAllPosts, toggleReact, getPost, deletePost };
