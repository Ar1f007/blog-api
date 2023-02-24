const { z } = require('zod');

const PaginationSchema = z.object({
  page: z
    .string()
    .transform((val) => parseInt(val))
    .optional(),
  limit: z
    .string()
    .transform((val) => parseInt(val))
    .optional(),
});

module.exports = PaginationSchema;