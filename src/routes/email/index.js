const sendEmail = require('../../controllers/email');
const middleware = require('../../middlewares');
const ValidationSchema = require('../../validations/email');

const router = require('express').Router();

router
  .route('/')
  .post(
    middleware.validate(ValidationSchema.EmailSchema, 'body'),
    middleware.authenticateUser,
    sendEmail
  );

module.exports = router;