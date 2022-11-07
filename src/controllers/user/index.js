const { StatusCodes } = require('http-status-codes');

const { asyncWrapper } = require('../../utils');
const AppError = require('../../utils/appError');
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

  const data = { ...user._doc, password: undefined };

  res.status(StatusCodes.CREATED).json({
    success: true,
    user: data,
  });
});

module.exports = { signup };
