const { z } = require('zod');
const { IdSchema } = require('../others');

exports.ReactSchema = z.object({
  action: z.object({
    isLiked: z.boolean(),
  }),
  postId: IdSchema,
});
