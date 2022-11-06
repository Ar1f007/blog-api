const { asyncWrapper } = require('../../utils');

const register = asyncWrapper(async (req, res) => {
  const body = req.body;
  console.log(body);
  res.status(200).json({ msg: 'Register' });
});

module.exports = { register };
