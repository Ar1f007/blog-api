const router = require('express').Router();

const middleware = require('../../middleware');
const user = require('../../controllers/user');
const userValidation = require('../../validations/user');
const { ADMIN } = require('../../constants');

router
  .route('/')
  .post(middleware.validate(userValidation.SignupSchema, 'body'), user.signup)
  .get(user.getAllUsers);

router
  .route('/login')
  .post(middleware.validate(userValidation.LoginSchema, 'body'), user.login);

router
  .route('/profile/:userId')
  .get(
    middleware.validate(userValidation.UserIdSchema, 'params'),
    middleware.authenticateUser,
    user.myProfile
  );

router
  .route('/password/update')
  .patch(
    middleware.validate(userValidation.UpdatePasswordSchema, 'body'),
    middleware.authenticateUser,
    user.updateUserPassword
  );

router
  .route('/follow')
  .patch(
    middleware.validate(userValidation.UserIdSchema, 'body'),
    middleware.authenticateUser,
    user.followUser
  );

router
  .route('/unfollow')
  .patch(
    middleware.validate(userValidation.UserIdSchema, 'body'),
    middleware.authenticateUser,
    user.unfollowUser
  );

router
  .route('/block-user')
  .patch(
    middleware.validate(userValidation.UserIdSchema, 'body'),
    middleware.authenticateUser,
    middleware.authorizePermission(ADMIN),
    user.blockUser
  );

router
  .route('/unblock-user')
  .patch(
    middleware.validate(userValidation.UserIdSchema, 'body'),
    middleware.authenticateUser,
    middleware.authorizePermission(ADMIN),
    user.unblockUser
  );

router
  .route('/verify-account/:token')
  .get(middleware.authenticateUser, user.verifyAccount);

router
  .route('/forget-password-code')
  .post(
    middleware.validate(userValidation.EmailSchema, 'body'),
    user.createForgetPasswordCode
  );

router
  .route('/reset-password')
  .patch(
    middleware.validate(userValidation.ResetPasswordSchema, 'body'),
    user.resetPassword
  );

router
  .route('/upload-files')
  .patch(
    middleware.authenticateUser,
    middleware.uploadAvatar,
    middleware.resizeAvatar,
    user.uploadAvatar
  );

router
  .route('/deactivate-account')
  .patch(middleware.authenticateUser, user.deactivateUser);

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
    middleware.authenticateUser,
    user.deleteUser
  );

router
  .route('/dashboard-info/:userId')
  .get(
    middleware.validate(userValidation.UserIdSchema, 'params'),
    user.getDashboardInfo
  );

module.exports = router;
