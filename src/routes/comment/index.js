const router = require('express').Router();
const middleware = require('../../middleware');
const comment = require('../../controllers/comment');

router.route('/').post(middleware.authenticateUser, comment.createComment);