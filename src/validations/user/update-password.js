const { z } = require('zod');
const { nonEmptyFieldErrMsg } = require('../../utils');

const UpdatePasswordSchema = z.object({
  oldPassword: z.string(
    nonEmptyFieldErrMsg({ fieldName: 'old password', type: 'text' })
  ),
  newPassword: z
    .string(nonEmptyFieldErrMsg({ fieldName: 'new password', type: 'text' }))
    .trim()
    .min(5, { message: 'Must be 5 or more characters long' })
    .max(25, { message: 'Must be 25 or fewer characters long' }),
});

module.exports = UpdatePasswordSchema;