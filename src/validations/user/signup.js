const { z } = require('zod');
const { nonEmptyFieldErrMsg } = require('../../utils');

const SignupSchema = z.object({
  firstName: z
    .string(nonEmptyFieldErrMsg({ fieldName: 'first name', type: 'text' }))
    .trim()
    .min(3, { message: 'First name must be at least 3 character(s)' }),

  lastName: z
    .string({
      required_error: 'Last name is required',
      invalid_type_error: 'Last name must be a type of text',
    })
    .trim()
    .min(1, { message: 'Last name is required' }),

  email: z.string().trim().email({ message: 'Invalid email address' }),

  password: z
    .string({
      required_error: 'First name is required',
      invalid_type_error: 'First name must be a type of text',
    })
    .trim()
    .min(5, { message: 'Must be 5 or more characters long' })
    .max(25, { message: 'Must be 25 or fewer characters long' }),
});

module.exports = SignupSchema;