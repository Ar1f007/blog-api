const { z } = require('zod');
const { nonEmptyFieldErrMsg } = require('../../utils');

const SignupSchema = z.object({
  username: z
    .string(nonEmptyFieldErrMsg({ fieldName: 'username', type: 'text' }))
    .trim()
    .min(3, { message: 'Username should be at least 3 character(s)' }),

  firstName: z
    .string(nonEmptyFieldErrMsg({ fieldName: 'first name', type: 'text' }))
    .trim()
    .min(3, { message: 'First name must be at least 3 character(s)' }),

  lastName: z
    .string(nonEmptyFieldErrMsg({ fieldName: 'last name', type: 'text' }))
    .trim()
    .min(1, { message: 'Last name is required' }),

  email: z.string().trim().email({ message: 'Invalid email address' }),

  password: z
    .string(nonEmptyFieldErrMsg({ fieldName: 'password', type: 'string' }))
    .trim()
    .min(5, { message: 'Must be 5 or more characters long' })
    .max(25, { message: 'Must be 25 or fewer characters long' }),
});

module.exports = SignupSchema;