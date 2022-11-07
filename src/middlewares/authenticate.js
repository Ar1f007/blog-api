const { StatusCodes } = require('http-status-codes');
const { AppError, isTokenValid } = require('../utils');

const authenticateUser = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    throw new AppError('Authentication invalid', StatusCodes.UNAUTHORIZED);
  }

  try {
    const data = isTokenValid(token);
    req.user = data;

    next();
  } catch (error) {
    throw new AppError('Authentication invalid', StatusCodes.FORBIDDEN);
  }
};

module.exports = authenticateUser;