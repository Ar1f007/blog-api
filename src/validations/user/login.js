const { z } = require('zod');
const { nonEmptyFieldErrMsg } = require('../../utils');

const LoginSchema = z.object({
  emailOrUsername: z
    .string()
    .trim()
    .min(1, { message: 'Email or username is required' }),

  password: z
    .string(nonEmptyFieldErrMsg({ fieldName: 'password', type: 'string' }))
    .trim(),
});

module.exports = LoginSchema;