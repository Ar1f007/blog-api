const { StatusCodes } = require('http-status-codes');

const errorHandler = (err, req, res, next) => {
  let customError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || 'Something went wrong',
  };

  if (err.name === 'ValidationError') {
    customError.message = Object.values(err.errors)
      .map((item) => item.message)
      .join(',');
    customError.statusCode = 400;
  }

  if (err.code && err.code === 11000) {
    customError.message = `${Object.keys(
      err.keyValue
    )} already exists, please choose another`;
    customError.statusCode = 400;
  }

  if (err.name === 'CastError') {
    customError.message = `No data found for : ${err.value}`;
    customError.statusCode = 404;
  }

  const stack = process.env.NODE_ENV === 'production' ? null : err.stack;

  return res.status(customError.statusCode).json({
    success: false,
    message: customError.message,
    stack,
  });
};

module.exports = errorHandler;