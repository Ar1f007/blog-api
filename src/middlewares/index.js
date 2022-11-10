
const { uploadAvatar, resizeAvatar } = require('./upload-file');
const authenticateUser = require('./authenticate');
const authorizePermission = require('./authorize-permission');
const errorHandler = require('./errorHandler');
const notFound = require('./notFound');
const validate = require('./validator');

module.exports = {
  authenticateUser,
  authorizePermission,
  errorHandler,
  notFound,
  resizeAvatar,
  uploadAvatar,
  validate,
};
