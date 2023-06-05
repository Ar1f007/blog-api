const { StatusCodes } = require('http-status-codes');

const { asyncWrapper, slugify, AppError } = require('../../utils');
const { getCategoryId, getTagIds, updatePostCount } = require('./util');
const { Post } = require('../../models');
const { uploadCoverImage } = require('./upload-cover-image');
const { ADMIN } = require('../../constants');
const Reaction = require('../../models/reaction');
const Comment = require('../../models/comment');

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

  postData.author = authorId;
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
  if (req.params.slug === 'create') {
    const post = await Post.create(postData);

    if (!post) {
      throw new AppError(
        'Could not create post',
        StatusCodes.EXPECTATION_FAILED
      );
    }

    // increment post count by 1
    await updatePostCount(authorId, 1);

    return res.status(StatusCodes.CREATED).json({ success: true, post });
  }

  // Payload includes cover image
  const url = await uploadCoverImage(req.file.filename);
  postData.coverImage = url;

  const post = await Post.create(postData);

  if (!post) {
    throw new AppError('Could not create post', StatusCodes.EXPECTATION_FAILED);
  }

  // increment post count by 1
  await updatePostCount(authorId, 1);

  res.status(StatusCodes.CREATED).json({ success: true, post });
});

/**
 * @desc Update a post
 * @route PATCH /api/posts/update/:slug || /api/posts/update/no-image/:slug
 * @access Private
 */
const updatePost = asyncWrapper(async (req, res) => {
  const { postId } = req.params;
  let postData = {};

  const { title, description, category, tags } = req.body;

  postData.title = title;
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

  // "no-image" - indicating a payload without coverImage
  if (req.params.indication === 'no-image') {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $set: {
          ...postData,
        },
      },
      {
        new: true,
      }
    );

    if (!post) {
      throw new AppError('No post found', StatusCodes.BAD_REQUEST);
    }

    return res.status(StatusCodes.OK).json({ success: true, post });
  }

  // Payload includes cover image
  const url = await uploadCoverImage(req.file.filename);
  postData.coverImage = url;

  const post = await Post.findByIdAndUpdate(
    postId,
    { $set: { ...postData } },
    { new: true }
  );

  if (!post) {
    throw new AppError('No post found', StatusCodes.BAD_REQUEST);
  }

  res.status(StatusCodes.OK).json({ success: true, post });
});

/**
 * @desc Get the list of post which were already published (Date <= Current Time)
 * @route GET /api/posts
 * @access Public
 */
const getAllPosts = asyncWrapper(async (req, res) => {
  const { page = 1, limit = 6, categoryId } = req.query;

  const query = { published_at: { $lte: Date.now() }, displayStatus: true };

  if (categoryId) {
    query.category = categoryId;
  }

  const populateFields = [
    {
      path: 'author',
      select: 'firstName lastName photo',
    },
    {
      path: 'category',
      select: 'id name slug',
    },
    {
      path: 'tags',
      select: 'name slug',
    },
  ];

  const byLatestFirst = { createdAt: -1 };

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const postsQuery = Post.find(query)
    .populate(populateFields)
    .sort(byLatestFirst);

  if (limit) {
    postsQuery.skip(startIndex).limit(limit);
  }

  const posts = await postsQuery.lean().exec();

  const postCount = await Post.countDocuments(query).exec();

  let pagination = {};

  if (endIndex < postCount) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res
    .status(StatusCodes.OK)
    .json({ success: true, posts, totalPosts: postCount, pagination });
});

/**
 * @desc Get single post details
 * @route GET /api/posts/:slug
 * @access Public
 */
const getPost = asyncWrapper(async (req, res) => {
  const slug = req.params.slug;

  const populateFields = [
    {
      path: 'author',
      select:
        'firstName lastName username photo email followers bio address createdAt',
    },
    {
      path: 'category',
      select: 'id name slug',
    },
    {
      path: 'tags',
      select: 'name slug',
    },
  ];

  const postPromise = Post.findOne({ slug })
    .populate(populateFields)
    .lean()
    .exec();

  const query = {
    postSlug: slug,
  };

  const totalCommentsPromise = Comment.countDocuments(query).exec();

  const [post, totalComments] = await Promise.all([
    postPromise,
    totalCommentsPromise,
  ]);

  if (!post) {
    throw new AppError('No post found', StatusCodes.BAD_REQUEST);
  }

  const data = {
    post: {
      id: post._id,
      slug: post.slug,
      coverImage: post.coverImage,
      title: post.title,
      description: post.description,
      views: post.numViews,
      isLiked: post.isLiked,
      likesCount: post.likesCount,
      likes: post.likes,
      published_at: post.published_at,
      category: post.category,
      tags: post.tags,
      totalComments,
    },
    author: {
      id: post.author._id,
      username: post.author.username,
      firstName: post.author.firstName || '',
      lastName: post.author.lastName || '',
      fullName: `${post.author.firstName || ''} ${post.author.lastName || ''}`,
      photo: post.author.photo,
      email: post.author.email,
      followers: post.author.followers.length,
      joined: post.author.createdAt,
      address: post.author.address || '',
    },
  };

  res.status(StatusCodes.OK).json({ success: true, data });
});

/**
 * @desc Get authors post
 * @route GET /api/posts/author-posts/:userId
 * @access Private
 */
const getAuthorsPosts = asyncWrapper(async (req, res) => {
  const id = req.params.userId;
  const { userId } = req.user;

  if (id !== userId) {
    throw new AppError('You are not authorized', StatusCodes.FORBIDDEN);
  }

  const posts = await Post.find({ author: userId })
    .populate('category')
    .populate('tags')
    .lean()
    .exec();

  res.status(StatusCodes.OK).json({ success: true, posts });
});

/**
 * @desc Delete post
 * @route /api/posts/:slug
 * @access Private
 */
const deletePost = asyncWrapper(async (req, res) => {
  const { userId, role } = req.user;

  const { slug } = req.params;

  const post = await Post.findOne({ slug }).lean().select('author').exec();

  if (!post) {
    throw new AppError('Post not found', StatusCodes.BAD_REQUEST);
  }

  if (role !== ADMIN && userId !== post.author.toString()) {
    throw new AppError(
      'You can not delete this post',
      StatusCodes.UNAUTHORIZED
    );
  }

  await Post.deleteOne({ slug });

  // decrement post count by 1
  await updatePostCount(userId, -1);

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

  const { userId, postId } = req.body;

  if (userId !== req.user.userId) {
    throw new AppError('Unauthorized', StatusCodes.UNAUTHORIZED);
  }

  // check if user has already liked it
  const docFound = await Reaction.findOne({ userId, postId }).lean().exec();

  // if it does not exist then create new doc
  if (!docFound) {
    const doc = await Reaction.create({ ...req.body });

    if (!doc) {
      throw new AppError(
        'Something went wrong',
        StatusCodes.EXPECTATION_FAILED
      );
    }

    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $inc: { likesCount: 1 },
      },

      { new: true }
    );

    return res
      .status(StatusCodes.CREATED)
      .json({ success: true, reactionCount: post.likesCount });
  }

  const doc = await Reaction.findByIdAndDelete(docFound._id).exec();

  if (!doc) {
    throw new AppError('Something went wrong', StatusCodes.EXPECTATION_FAILED);
  }

  const post = await Post.findByIdAndUpdate(
    postId,
    {
      $inc: { likesCount: -1 },
    },
    { new: true }
  );

  return res
    .status(StatusCodes.OK)
    .json({ success: true, reactionCount: post.likesCount });
});

module.exports = {
  createPost,
  getAllPosts,
  toggleReact,
  getPost,
  deletePost,
  getAuthorsPosts,
  updatePost,
};
