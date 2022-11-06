/**
 *
 * @param {controller} fn
 * @desc async try-catch wrapper
 */
exports.use = (fn) => async (req, res, next) => {
  try {
    await fn(req, res);
  } catch (error) {
    return next(error);
  }
};
