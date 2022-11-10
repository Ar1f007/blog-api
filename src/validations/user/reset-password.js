const { z } = require('zod');
const { nonEmptyFieldErrMsg } = require('../../utils');

const ResetPasswordSchema = z.object({
  code: z
    .string(nonEmptyFieldErrMsg({ fieldName: 'Code', type: 'Text/number' }))
    .min(6, { message: 'Invalid code' }),
  password: z
    .string(nonEmptyFieldErrMsg({ fieldName: 'Password', type: 'Text/number' }))
    .trim()
    .min(5, { message: 'Must be 5 or more characters long' })
    .max(25, { message: 'Must be 25 or fewer characters long' }),
});

module.exports = ResetPasswordSchema;