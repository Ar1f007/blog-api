const router = require('express').Router();
const category = require('../../controllers/category');

router.route('/').get(category.getAllCategories);

module.exports = router;