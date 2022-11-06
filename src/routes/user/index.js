const router = require('express').Router();
const user = require('../../controllers/user');

// prettier-ignore
router
  .route('/')
  .post(user.register);

module.exports = router;
