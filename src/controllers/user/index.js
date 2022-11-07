const { asyncWrapper } = require('../../utils');

const signup = asyncWrapper(async (req, res) => {
  res.status(200).json({ ok: 'ok' });
});

module.exports = { signup };
