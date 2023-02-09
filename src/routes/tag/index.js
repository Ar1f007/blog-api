const tag = require('../../controllers/tag');

const router = require('express').Router();

router.route('/').get(tag.getAllTags);

module.exports = router;