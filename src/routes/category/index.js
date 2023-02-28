const router = require('express').Router();
const { ADMIN } = require('../../constants');
const category = require('../../controllers/category');
const middleware = require('../../middleware');

router.route('/').get(category.getAllCategories);

router
  .route('/:id')
  .delete(
    middleware.authenticateUser,
    middleware.authorizePermission(ADMIN),
    category.deleteCategory
  );

module.exports = router;