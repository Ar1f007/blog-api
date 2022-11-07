const router = require('express').Router();

const middleware = require('../../middlewares');
const user = require('../../controllers/user');
const userValidation = require('../../validations/user');

// prettier-ignore
router
  .route('/')
  .post(middleware.validate(userValidation.signup, 'body'), user.signup);

module.exports = router;
