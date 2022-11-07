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
  };

  attachCookiesToResponse(res, user.id);

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
  };

  attachCookiesToResponse(res, user.id);

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

module.exports = {
  deleteUser,
  getAllUsers,
  getUserDetails,
  login,
  signup,
};
