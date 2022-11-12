const { asyncWrapper } = require('../../utils');

const createPost = asyncWrapper(async (req, res) => {
  res.json({ msg: 'OK' });
});

module.exports = { createPost };