const router = require('express').Router();
const { ADMIN } = require('../../constants');
const category = require('../../controllers/category');
const middleware = require('../../middleware');
const { NameSchema } = require('../../validations/others');

router.route('/').get(category.getAllCategories);

router
  .route('/:id')
  .put(
    middleware.authenticateUser,
    middleware.authorizePermission(ADMIN),
    middleware.validate(NameSchema, 'body'),
    category.updateCategory
  )
  .delete(
    middleware.authenticateUser,
    middleware.authorizePermission(ADMIN),
    category.deleteCategory
  );

module.exports = router;