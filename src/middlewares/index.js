const authenticateUser = require('./authenticate');
const authorizePermission = require('./authorize-permission');
const errorHandler = require('./errorHandler');
const notFound = require('./notFound');
const uploadFiles = require('./upload-file');
const validate = require('./validator');

module.exports = {
  authenticateUser,
  authorizePermission,
  errorHandler,
  notFound,
  uploadFiles,
  validate,
};
