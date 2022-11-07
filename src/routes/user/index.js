const router = require('express').Router();

const middleware = require('../../middlewares');
const user = require('../../controllers/user');
const userValidation = require('../../validations/user');

// prettier-ignore
router
  .route('/')
  .post(middleware.validate(userValidation.SignupSchema, 'body'), user.signup);

router
  .route('/login')
  .post(middleware.validate(userValidation.LoginSchema, 'body'), user.login);

module.exports = router;
