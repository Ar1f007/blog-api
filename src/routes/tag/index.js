const tag = require('../../controllers/tag');
const { ADMIN } = require('../../constants');
const middleware = require('../../middleware');
const { NameSchema } = require('../../validations/others');
const router = require('express').Router();

router.route('/').get(tag.getAllTags);

router
  .route('/:id')
  .put(
    middleware.authenticateUser,
    middleware.authorizePermission(ADMIN),
    middleware.validate(NameSchema, 'body'),
    tag.updateTag
  );

module.exports = router;