const { z } = require('zod');
const { nonEmptyFieldErrMsg } = require('../../utils');

const LoginSchema = z.object({
  email: z.string().trim().email({ message: 'Invalid email address' }),

  password: z
    .string(nonEmptyFieldErrMsg({ fieldName: 'password', type: 'string' }))
    .trim(),
});

module.exports = LoginSchema;