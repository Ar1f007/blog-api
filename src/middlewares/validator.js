
const { StatusCodes } = require('http-status-codes');

module.exports = (fn, property) => (req, res, next) => {
  const { error } = fn(req[property]);

  const valid = error == null;

  if (valid) {
    return next();
  }

  const { details } = error;

  const errors = {};

  details.map((errField) => {
    if (errField.type === 'object.unknown') {
      errors['unknown'] = 'Provide valid values';
      return;
    }
    errors[errField.context.key] = errField.message;
  });

  res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
    success: false,
    errors,
  });
};
