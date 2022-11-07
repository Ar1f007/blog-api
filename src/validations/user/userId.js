const { z } = require('zod');
const { Types } = require('mongoose');

const UserIdSchema = z.object({
  userId: z
    .string()
    .refine((id) => Types.ObjectId.isValid(id), { message: 'Not a valid id' }),
});

module.exports = UserIdSchema;