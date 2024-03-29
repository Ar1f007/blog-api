const { StatusCodes } = require('http-status-codes');
const { unlink } = require('fs/promises');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const {
  AppError,
  asyncWrapper,
  attachCookiesToResponse,
  sendEmail,
  uploadToCloudinary,
} = require('../../utils');
const User = require('../../models/user');

const { ADMIN } = require('../../constants');
const { Post } = require('../../models');

/**
 * @desc Register new user
 * @route POST /api/users
 * @access Public
 */
const signup = asyncWrapper(async (req, res) => {
  // check if user already exist with the same email
  const { email, username } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new AppError('Email already exists', StatusCodes.FORBIDDEN);
  }

  // or username
  const usernameTaken = await User.findOne({ username });

  if (usernameTaken) {
    throw new AppError('The username is taken', StatusCodes.CONFLICT);
  }

  const user = await User.create(req.body);

  if (!(user instanceof User)) {
    throw new AppError(
      'Could not create the account, try again after some time',
      StatusCodes.CONFLICT
    );
  }

  const verificationToken = await user.generateAccountVerificationToken();
  await user.save();

  await sendEmail(verificationToken, user);

  const data = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: user.firstName + ' ' + user.lastName,
    email: user.email,
    role: user.role,
    username: user.username,
    photo: user.photo,
  };

  attachCookiesToResponse(res, data);

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
  const emailOrUsername = req.body.emailOrUsername;

  const user = await User.findOne({
    $or: [{ username: emailOrUsername }, { email: emailOrUsername }],
  }).select('+password');

  if (!user) {
    throw new AppError('Invalid credentials', StatusCodes.UNAUTHORIZED);
  }

  const isPasswordCorrect = await user.comparePassword(req.body.password);

  if (!isPasswordCorrect) {
    throw new AppError('Invalid credentials', StatusCodes.UNAUTHORIZED);
  }

  user.active = true;
  await user.save();

  await Post.updateMany({ author: user.id }, { $set: { displayStatus: true } });

  const data = {
    id: user.id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    photo: user.photo,
    isBlocked: user.isBlocked,
    isAdmin: user.isAdmin,
    role: user.role,
    bio: user.bio,
    fullName: user.firstName + ' ' + user.lastName,
  };

  attachCookiesToResponse(res, data);

  res.status(StatusCodes.OK).json({
    success: true,
    user: data,
  });
});

/**
 * @desc Get list of all active users
 * @route GET /api/users
 * @access Public
 */
const getAllUsers = asyncWrapper(async (req, res) => {
  const users = await User.find({ active: true }).exec();

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
 * @desc Deactivates user
 * @route PATCH /api/users/deactivate-account/:userId
 * @access Private
 */
const deactivateUser = asyncWrapper(async (req, res) => {
  const { userId } = req.params;

  if (userId !== req.user.userId) {
    throw new AppError('Unauthorized', StatusCodes.FORBIDDEN);
  }

  const user = await User.findByIdAndUpdate(
    req.user.userId,
    {
      active: false,
    },
    { new: true }
  ).exec();

  if (!user) {
    throw new AppError('No user found', StatusCodes.NOT_FOUND);
  }

  await Post.updateMany(
    { author: user.id },
    { $set: { displayStatus: false } }
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Account deactivated successfully',
  });
});

/**
 * @desc Deletes a user permanently
 * @route DELETE /api/users/:id
 * @access Private
 */
const deleteUser = asyncWrapper(async (req, res) => {
  const role = req.user.role;

  if (req.user.userId !== req.params.userId && role !== ADMIN) {
    throw new AppError(
      'You are not authorized to perform this task',
      StatusCodes.FORBIDDEN
    );
  }
  const user = await User.findByIdAndDelete(req.params.userId).exec();

  if (!user) {
    throw new AppError('No user found', StatusCodes.NOT_FOUND);
  }

  res
    .status(StatusCodes.OK)
    .json({ success: true, message: 'Account is deleted.' });
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
  const { userId } = req.body;
  const followerId = req.user.userId;

  if (followerId === userId) {
    throw new AppError('Cannot follow yourself', StatusCodes.BAD_REQUEST);
  }

  const [follower, userToBeFollowed] = await Promise.all([
    User.findById(followerId),
    User.findById(userId),
  ]);

  if (!userToBeFollowed) {
    throw new AppError('User was not found', StatusCodes.BAD_REQUEST);
  }

  if (userToBeFollowed.followers.includes(followerId)) {
    throw new AppError('You are already following', StatusCodes.BAD_REQUEST);
  }

  if (follower.following.includes(userId)) {
    throw new AppError('You are already following', StatusCodes.BAD_REQUEST);
  }

  // Update userToBeFollowed's followers and isFollowing fields
  userToBeFollowed.followers.push(followerId);
  userToBeFollowed.isFollowing = true;
  await userToBeFollowed.save();

  // Update follower's following field
  follower.following.push(userId);
  await follower.save();

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
  const { userId } = req.body;
  const unfollowerId = req.user.userId;

  if (unfollowerId === userId) {
    throw new AppError('You cannot unfollow yourself', StatusCodes.BAD_REQUEST);
  }

  const [unfollower, userToBeUnfollowed] = await Promise.all([
    User.findById(unfollowerId),
    User.findById(userId),
  ]);

  if (!userToBeUnfollowed) {
    throw new AppError(
      'User to be unfollowed was not found',
      StatusCodes.BAD_REQUEST
    );
  }

  if (!unfollower.following.includes(userId)) {
    throw new AppError(
      'You are not following this user',
      StatusCodes.BAD_REQUEST
    );
  }

  // Remove unfollowerId from userToBeUnfollowed's followers and set isFollowing to false
  userToBeUnfollowed.followers = userToBeUnfollowed.followers.filter(
    (id) => id.toString() !== unfollowerId.toString()
  );
  userToBeUnfollowed.isFollowing = false;
  await userToBeUnfollowed.save();

  // Remove userId from unfollower's following
  unfollower.following = unfollower.following.filter(
    (id) => id.toString() !== userId.toString()
  );
  await unfollower.save();

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

/**
 * @desc Verify user account
 * @route GET /api/users/verify-account/:token
 * @access Private
 */
const verifyAccount = asyncWrapper(async (req, res) => {
  const token = req.params.token;

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    accountVerificationToken: hashedToken,
    accountVerificationTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError(
      'Token is invalid or has expired',
      StatusCodes.BAD_REQUEST
    );
  }

  user.isAccountVerified = true;
  user.accountVerificationToken = undefined;
  user.accountVerificationTokenExpires = undefined;

  await user.save();

  return res
    .status(StatusCodes.ACCEPTED)
    .json({ success: true, message: 'Account verified successfully' });
});

/**
 * @desc Create code for resetting password
 * @route POST /api/users/forget-password-code
 * @access public
 */
const createForgetPasswordCode = asyncWrapper(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).exec();

  if (!user) {
    throw new AppError(
      'There is no user with this email address.',
      StatusCodes.BAD_REQUEST
    );
  }

  const code = await user.createPasswordResetCode();

  await user.save();

  await sendEmail(code, user, false);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Enter the code we sent to your email here',
  });
});

/**
 * @desc Reset password for the account
 * @route POST /api/users/reset-password
 * @access Public
 */
const resetPassword = asyncWrapper(async (req, res) => {
  const { code, password } = req.body;

  const hashedToken = crypto.createHash('sha256').update(code).digest('hex');

  // find the user with hashed token - the token which has not expired yet
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError(
      'Code is invalid or has expired',
      StatusCodes.BAD_REQUEST
    );
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  res
    .status(StatusCodes.ACCEPTED)
    .json({ success: true, message: 'Password reset successful!' });
});

const uploadAvatar = asyncWrapper(async (req, res) => {
  const filePath = `public/img/users/${req.file.filename}`;
  const imgUrl = await uploadToCloudinary(filePath, 'users');

  const userId = req.user.userId;

  const user = await User.findByIdAndUpdate(
    userId,
    { photo: imgUrl },
    { new: true }
  ).exec();

  await unlink(filePath);

  res.status(StatusCodes.OK).json({
    success: true,
    photo: user.photo,
    message: 'Image uploaded successfully',
  });
});

const getDashboardInfo = asyncWrapper(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError('User not found', StatusCodes.BAD_REQUEST);
  }

  const data = {
    totalPosts: user.postCount,
    totalFollowers: user.followers.length,
    totalFollowing: user.following.length,
    totalFollowingCategories: 0,
    totalFollowingTags: 0,
  };

  return res
    .status(StatusCodes.OK)
    .json({ success: true, dashboardInfo: data });
});

module.exports = {
  blockUser,
  createForgetPasswordCode,
  deactivateUser,
  deleteUser,
  followUser,
  getAllUsers,
  getDashboardInfo,
  getUserDetails,
  login,
  myProfile,
  resetPassword,
  signup,
  unblockUser,
  unfollowUser,
  updateUser,
  updateUserPassword,
  uploadAvatar,
  verifyAccount,
};

