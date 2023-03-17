const { z } = require('zod');
const { IdSchema } = require('../others');

exports.CreateCommentSchema = z.object({
  postSlug: z.string(),
  postId: IdSchema,
  content: z.string().min(1),
});

exports.ParamIdSchema = z.object({
  id: IdSchema,
});

exports.CommentContentSchema = z.object({
  content: z.string(),
});