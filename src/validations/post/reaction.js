const { z } = require('zod');
const { IdSchema } = require('../others');

const ReactionSchema = z.object({
  postId: IdSchema,
  userId: IdSchema,
});

module.exports = ReactionSchema;