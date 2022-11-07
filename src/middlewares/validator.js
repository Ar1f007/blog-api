const { StatusCodes } = require('http-status-codes');

/**
 *
 * @param {ZodSchema} Schema
 * @param {'body' | 'query' | 'params'} property
 * @returns
 */
module.exports = (Schema, property) => (req, res, next) => {
  try {
    const data = Schema.parse(req[property]);
    req[property] = data;

    next();
  } catch (error) {
    const errors = error.errors.map((issue) => ({
      fieldName: issue.path[0],
      message: issue.message,
    }));

    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      success: false,
      errors,
    });
  }
};