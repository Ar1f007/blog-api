const { z } = require('zod');
const { IdSchema } = require('../other');

exports.CreatePostSchema = z.object({
  title: z.string().trim().min(10),
  description: z.string().trim().min(50),
  category: z.string().trim(),
  authorId: IdSchema,
});