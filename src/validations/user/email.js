const { z } = require('zod');
const { nonEmptyFieldErrMsg } = require('../../utils');

const EmailSchema = z.object({
  email: z
    .string(nonEmptyFieldErrMsg({ fieldName: 'Email', type: 'email' }))
    .email({ message: 'Invalid email' }),
});

module.exports = EmailSchema;