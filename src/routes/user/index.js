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
    middleware.validate(userValidation.UserIdSchema, 'params'),
    user.getUserDetails
  )
  .patch(
    middleware.validate(userValidation.UserIdSchema, 'params'),
    middleware.validate(userValidation.UpdateUserSchema, 'body'),
    middleware.authenticateUser,
    user.updateUser
  )
  .delete(
    middleware.validate(userValidation.UserIdSchema, 'params'),
    user.deleteUser
  );

router
  .route('/profile/:userId')
  .get(
    middleware.validate(userValidation.UserIdSchema, 'params'),
    middleware.authenticateUser,
    user.myProfile
  );

module.exports = router;
