const { StatusCodes } = require('http-status-codes');
const { AppError } = require('../utils');

const authorizePermission = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError(
        'You are not authorized to perform this task',
        StatusCodes.FORBIDDEN
      );
    }

    next();
  };
};

module.exports = authorizePermission;