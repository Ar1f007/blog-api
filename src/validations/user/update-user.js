const { z } = require('zod');
const { nonEmptyFieldErrMsg } = require('../../utils');

const UpdateUserSchema = z.object({
  firstName: z
    .string(nonEmptyFieldErrMsg({ fieldName: 'first name', type: 'text' }))
    .trim()
    .min(3, { message: 'First name must be at least 3 character(s)' })
    .optional(),

  lastName: z
    .string(nonEmptyFieldErrMsg({ fieldName: 'last name', type: 'text' }))
    .trim()
    .min(1, { message: 'Last name is required' })
    .optional(),
  email: z
    .string()
    .trim()
    .email({ message: 'Invalid email address' })
    .optional(),
  bio: z.string().optional(),
});

module.exports = UpdateUserSchema;