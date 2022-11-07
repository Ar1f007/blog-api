class AppError extends Error {
  /**
   *
   * @param {string} message
   * @param {number} statusCode
   */
  constructor(message, statusCode, err) {
    super(message);
    this.statusCode = statusCode;
    this.error = err;
  }
}

module.exports = AppError;
