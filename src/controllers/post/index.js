const { StatusCodes } = require('http-status-codes');

const { asyncWrapper, slugify, AppError } = require('../../utils');
const { getCategoryId, getTagIds } = require('./util');
const { Post } = require('../../models');
const { uploadCoverImage } = require('./upload-cover-image');
const { ADMIN } = require('../../constants');
const Reaction = require('../../models/reaction');

/**
 * @desc Add a new post
 * @route POST /api/posts
 * @access Private
 */
const createPost = asyncWrapper(async (req, res) => {
  let postData = {};

  const { category, tags, title, published_at, description } = req.body;

  const authorId = req.user.userId;

  const slugTitle = slugify(title);

  postData.authorId = authorId;
  postData.slug = slugTitle;
  postData.title = title;
  postData.description = description;
  postData.published_at = published_at;

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

  // create - indicating a payload without coverImage
  if (req.params.create) {
    const post = await Post.create(postData);
    return res.status(StatusCodes.CREATED).json({ success: true, post });
  }

  // Payload includes cover image
  const url = await uploadCoverImage(req.file.filename);
  postData.coverImage = url;

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
 * @route /api/posts/:slug
 * @access Private
 */
const deletePost = asyncWrapper(async (req, res) => {
  const { userId, role } = req.user;

  const { slug } = req.params;

  const post = await Post.findOne({ slug }).lean().select('authorId').exec();

  if (!post) {
    throw new AppError('Post not found', StatusCodes.BAD_REQUEST);
  }

  if (role !== ADMIN && userId !== post.authorId.toString()) {
    throw new AppError(
      'You can not delete this post',
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
 * @route PATCH /api/posts/:slug/reaction
 * @access Private
 */
const toggleReact = asyncWrapper(async (req, res) => {
  // 1. Check if the userId and logged in user is the same, if not throw error
  // 2. Condition
  //    i. If there is a document already exists in reaction table
  // - update the 'isLiked' field
  // - inc or dec 'likesCount' of the post according to { isLiked: true / false }
  //    ii. No document found with the user id and post id
  // - create one
  // - update the 'isLiked' field to true
  // - inc 'likesCount' by 1

  const { userId, postId, isLiked } = req.body;

  if (userId !== req.user.userId) {
    throw new AppError('Unauthorized', StatusCodes.UNAUTHORIZED);
  }

  // check if user has already liked it
  const docFound = await Reaction.findOne({ userId, postId }).lean().exec();

  // if it does not exist then create new doc
  if (!docFound) {
    const doc = await Reaction.create({ ...req.body, isLiked: true });
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $inc: { likesCount: 1 },
      },
      { new: true }
    );

    return res
      .status(StatusCodes.CREATED)
      .json({ success: true, reactionCount: post.likesCount, doc });
  }

  let post;

  // inc or decrement dependent upon isLiked value
  let options = {
    $inc: { likesCount: isLiked ? 1 : -1 },
  };

  // document is created but now in case of user liked / disliked update the isLiked field
  const doc = await Reaction.findByIdAndUpdate(
    docFound._id,
    { isLiked },
    { new: true }
  );

  // if liked then update likesCount field - increment by one
  if (isLiked) {
    post = await Post.findByIdAndUpdate(postId, options, { new: true });

    return res
      .status(StatusCodes.OK)
      .json({ success: true, reactionCount: post.likesCount, doc });
  }

  // since disliked then update likesCount field - decrement by one
  post = await Post.findByIdAndUpdate(postId, options, { new: true });

  res
    .status(StatusCodes.OK)
    .json({ success: true, reactionCount: post.likesCount, doc });
});

module.exports = { createPost, getAllPosts, toggleReact, getPost, deletePost };
