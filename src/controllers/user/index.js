const { StatusCodes } = require('http-status-codes');

const {
  asyncWrapper,
  AppError,
  attachCookiesToResponse,
} = require('../../utils');
const User = require('../../models/user');

/**
 * @desc Register new user
 * @route POST /api/users
 * @access Public
 */
const signup = asyncWrapper(async (req, res) => {
  // check if user already exist with the same email
  const userExists = await User.findOne({ email: req.body.email });

  if (userExists) {
    throw new AppError('Email already exists', StatusCodes.FORBIDDEN);
  }

  const user = await User.create(req.body);

  if (!(user instanceof User)) {
    throw new AppError(
      'Could not create the account, try again after some time',
      StatusCodes.CONFLICT
    );
  }

  const data = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
  };

  attachCookiesToResponse(res, user);

  res.status(StatusCodes.CREATED).json({
    success: true,
    user: data,
  });
});

/**
 * @desc User Login
 * @route POST /api/users/login
 * @access Public
 */
const login = asyncWrapper(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select(
    '+password'
  );

  if (!user) {
    throw new AppError('Invalid credentials', StatusCodes.UNAUTHORIZED);
  }

  const isPasswordCorrect = await user.comparePassword(req.body.password);

  if (!isPasswordCorrect) {
    throw new AppError('Invalid credentials', StatusCodes.UNAUTHORIZED);
  }

  const data = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    photo: user.photo,
    isBlocked: user.isBlocked,
    isAdmin: user.isAdmin,
    role: user.role,
  };

  attachCookiesToResponse(res, data);

  res.status(StatusCodes.OK).json({
    success: true,
    user: data,
  });
});

/**
 * @desc Get list of all users
 * @route GET /api/users
 * @access Public
 */
const getAllUsers = asyncWrapper(async (req, res) => {
  const users = await User.find().exec();

  res.status(StatusCodes.OK).json({
    success: true,
    users,
  });
});

/**
 * @desc Get details of a single user
 * @route GET /api/users/userId
 * @access Public
 */
const getUserDetails = asyncWrapper(async (req, res) => {
  const user = await User.findById(req.params.userId).exec();

  if (!user) {
    throw new AppError('No user found', StatusCodes.NOT_FOUND);
  }

  return res.status(StatusCodes.OK).json({
    success: true,
    user,
  });
});

/**
 * @desc Profile details when user sign in
 * @route GET /api/users/profile/:userId
 * @access Private
 */
const myProfile = asyncWrapper(async (req, res) => {
  const user = await User.findById(req.params.userId).exec();

  if (!user) {
    throw new AppError('Could not find the data', StatusCodes.NOT_FOUND);
  }

  return res.status(StatusCodes.OK).json({
    success: true,
    user,
  });
});

/**
 * @desc Remove a single user
 * @route DELETE /api/users/:id
 * @access Private
 */
const deleteUser = asyncWrapper(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.userId).exec();

  if (!user) {
    throw new AppError('Could not find the user', StatusCodes.NOT_FOUND);
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'User deleted successfully',
  });
});

/**
 * @desc Update user details - name, email, bio
 * @route PATCH /api/users/:userId
 * @access Private
 */
const updateUser = asyncWrapper(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.userId,
    {
      ...req.body,
    },
    {
      new: true,
      runValidators: true,
    }
  ).exec();

  res.status(200).json({
    success: true,
    user,
  });
});

/**
 * @desc Update user password
 * @route PATCH /api/users/password/update
 * @access Private
 */
const updateUserPassword = asyncWrapper(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user.userId).select('+password').exec();

  if (!user) {
    throw new AppError(
      'Not authorized, Login again.',
      StatusCodes.UNAUTHORIZED
    );
  }

  const isPasswordCorrect = await user.comparePassword(oldPassword);

  if (!isPasswordCorrect) {
    throw new AppError('Invalid old password', StatusCodes.UNAUTHORIZED);
  }

  user.password = newPassword;
  await user.save();

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Success! Password updated.',
  });
});

/**
 * @desc Follow user
 * @route PATCH /api/users/follow
 * @access Private
 */
const followUser = asyncWrapper(async (req, res) => {
  // 1. find the user you want to follow and update it's "followers" with your id
  // id of you
  const followerId = req.user.userId;

  // id of the user to be followed
  const toBeFollowedUserId = req.body.userId;

  if (followerId === toBeFollowedUserId) {
    throw new AppError('Can not follow yourself', StatusCodes.BAD_REQUEST);
  }

  // check to see if you're already following the user
  const targetUser = await User.findById(toBeFollowedUserId).exec();

  if (!targetUser) {
    throw new AppError('User was not found', StatusCodes.BAD_REQUEST);
  }

  const alreadyFollowing = targetUser.followers.find(
    (id) => id.toString() === followerId.toString()
  );

  if (alreadyFollowing) {
    throw new AppError('You are already following', StatusCodes.BAD_REQUEST);
  }

  // add your id to the follower's 'followers' list
  const user = await User.findByIdAndUpdate(
    toBeFollowedUserId,
    {
      $push: { followers: followerId },
      isFollowing: true,
    },
    { new: true }
  ).exec();

  if (!user) {
    throw new AppError('Could not perform the task', StatusCodes.CONFLICT);
  }

  // 2. update your own "isFollowing" field with the user id who you followed
  await User.findByIdAndUpdate(
    followerId,
    {
      $push: { following: toBeFollowedUserId },
    },
    { new: true }
  ).exec();

  return res
    .status(StatusCodes.OK)
    .json({ success: true, message: 'Success!' });
});

/**
 * @desc Unfollow user
 * @route PATCH /api/users/unfollow
 * @access Private
 */
const unfollowUser = asyncWrapper(async (req, res) => {
  // 1. find the user you want to unfollow and remove your id from it's "followers" list
  // id of you
  const unfollowerId = req.user.userId;

  // id of the user to be followed
  const toBeUnfollowedUserId = req.body.userId;

  if (unfollowerId === toBeUnfollowedUserId) {
    throw new AppError(
      'You can not unfollow yourself',
      StatusCodes.BAD_REQUEST
    );
  }

  // remove your id from the to be unfollowed user's 'followers' list
  const user = await User.findByIdAndUpdate(
    toBeUnfollowedUserId,
    {
      $pull: { followers: unfollowerId },
      isFollowing: false,
    },
    { new: true }
  ).exec();

  if (!user) {
    throw new AppError('Could not perform the task', StatusCodes.CONFLICT);
  }

  // 2. update your own "isFollowing" field with the user id who you unfollowed
  await User.findByIdAndUpdate(
    unfollowerId,
    {
      $pull: { following: toBeUnfollowedUserId },
    },
    { new: true }
  ).exec();

  return res
    .status(StatusCodes.OK)
    .json({ success: true, message: 'Success!' });
});

/**
 * @desc Block a user
 * @route PATCH /api/users/block-user
 * @access Private
 */
const blockUser = asyncWrapper(async (req, res) => {
  const { userId } = req.body;

  const user = await User.findByIdAndUpdate(
    userId,
    { isBlocked: true },
    { new: true }
  );

  if (!user) {
    throw new AppError(
      'Could not perform the task',
      StatusCodes.EXPECTATION_FAILED
    );
  }

  res.status(StatusCodes.OK).json({ success: true, message: 'Success!' });
});

/**
 * @desc Unblock a user
 * @route PATCH /api/users/unblock-user
 * @access Private
 */
const unblockUser = asyncWrapper(async (req, res) => {
  const { userId } = req.body;

  const user = await User.findByIdAndUpdate(
    userId,
    { isBlocked: false },
    { new: true }
  );

  if (!user) {
    throw new AppError(
      'Could not perform the task',
      StatusCodes.EXPECTATION_FAILED
    );
  }

  res.status(StatusCodes.OK).json({ success: true, message: 'Success!' });
});

module.exports = {
  blockUser,
  deleteUser,
  followUser,
  getAllUsers,
  getUserDetails,
  login,
  myProfile,
  signup,
  unblockUser,
  unfollowUser,
  updateUser,
  updateUserPassword,
};

