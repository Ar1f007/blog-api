const { z } = require('zod');
const { IdSchema } = require('../others');

exports.CreatePostSchema = z.object({
  title: z.string().trim().min(1, { message: "Title can't be blank" }),

  description: z.string().trim().min(1, { message: 'Content is required' }),

  category: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        return JSON.parse(val);
      }
      return val;
    },
    z
      .object({
        categoryId: IdSchema,
        newCategoryName: z.string(),
      })
      .partial()
      .superRefine((data, ctx) => {
        if (!data.categoryId && !data.newCategoryName) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              'One of either existed category id or a new category name must be given',
          });
        }

        if (data.categoryId && data.newCategoryName) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              'Either category id or a new category name is accepted, not both',
          });
        }
      })
  ),
  tags: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        return JSON.parse(val);
      }
      return val;
    },
    z
      .object({
        ids: IdSchema.array().superRefine((arr, ctx) => {
          if (arr.length !== new Set(arr).size) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `No duplicates(tag id) allowed`,
            });
          }
        }),

        newTagNames: z
          .string()
          .array()
          .superRefine((arr, ctx) => {
            if (arr.length !== new Set(arr).size) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Duplicate tag names',
              });
            }
          }),
      })
      .partial()
      .superRefine((data, ctx) => {
        if (!data.ids && !data.newTagNames) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Either of the tag array id or name must be provided',
          });
        }
      })
  ),
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