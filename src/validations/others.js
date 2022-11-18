const { z } = require('zod');
const { Types } = require('mongoose');

exports.IdSchema = z
  .string()
  .refine((id) => Types.ObjectId.isValid(id), { message: 'Not a valid id' });

exports.SlugSchema = z.object({
  slug: z.string(),
});