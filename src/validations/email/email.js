const { z } = require('zod');
const { nonEmptyFieldErrMsg } = require('../../utils');

const EmailSchema = z.object({
  from: z
    .string(nonEmptyFieldErrMsg({ fieldName: 'from', type: 'email' }))
    .email({ message: 'Invalid email' }),
  to: z
    .string(nonEmptyFieldErrMsg({ fieldName: 'from', type: 'email' }))
    .email({ message: 'Invalid email' }),
  message: z.string(),
  subject: z.string(),
});

module.exports = EmailSchema;