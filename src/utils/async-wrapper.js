/**
 *
 * @param {controller} fn - a controller function
 * @desc async try-catch wrapper
 */
module.exports = (fn) => async (req, res, next) => {
  try {
    await fn(req, res);
  } catch (error) {
    return next(error);
  }
};
