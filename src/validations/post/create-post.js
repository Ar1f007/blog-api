const { z } = require('zod');
const { IdSchema } = require('../other');

exports.CreatePostSchema = z.object({
  title: z.string().trim().min(5),
  description: z.string().trim().min(15),
  authorId: IdSchema,
  category: z.string().trim().min(3),
  tags: z.string().array().optional(),
  published_at: z.preprocess(
    (arg) => {
      if (typeof arg === 'string' || arg instanceof Date) return new Date(arg);
    },
    z.date({
      required_error: 'Please select a date and time',
      invalid_type_error: "That's not a date!",
    })
  ),
});
