const { z } = require('zod');
const { IdSchema } = require('../others');

const PaginationSchema = z.object({
  page: z
    .string()
    .transform((val) => parseInt(val))
    .optional(),
  limit: z
    .string()
    .transform((val) => parseInt(val))
    .optional(),
  categoryId: IdSchema.optional(),
});

module.exports = PaginationSchema;