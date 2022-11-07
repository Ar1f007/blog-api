const router = require('express').Router();

const middleware = require('../../middlewares');
const user = require('../../controllers/user');
const userValidation = require('../../validations/user');

// prettier-ignore
router
  .route('/')
  .post(middleware.validate(userValidation.SignupSchema, 'body'), user.signup)
  .get(user.getAllUsers);

router
  .route('/login')
  .post(middleware.validate(userValidation.LoginSchema, 'body'), user.login);

router
  .route('/:userId')
  .get(
    middleware.validate(userValidation.userIdSchema, 'params'),
    user.getUserDetails
  )
  .delete(
    middleware.validate(userValidation.userIdSchema, 'params'),
    user.deleteUser
  );

module.exports = router;
