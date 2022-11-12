const { uploadToCloudinary } = require('./cloudinary.js');
const AppError = require('./appError.js');
const asyncWrapper = require('./async-wrapper');
const attachCookiesToResponse = require('./jwt/attach-cookies-to-response');
const connect = require('./connect');
const createToken = require('./jwt/create-jwt-token');
const isTokenValid = require('./jwt/is-token-valid');
const logger = require('./logger');
const nonEmptyFieldErrMsg = require('./populate-error-msg');
const send = require('./send');
const sendEmail = require('./send-email');
const slugify = require('./slugify');
const validator = require('./validator');

module.exports = {
  AppError,
  asyncWrapper,
  attachCookiesToResponse,
  connect,
  createToken,
  isTokenValid,
  logger,
  nonEmptyFieldErrMsg,
  send,
  sendEmail,
  slugify,
  uploadToCloudinary,
  validator,
};
