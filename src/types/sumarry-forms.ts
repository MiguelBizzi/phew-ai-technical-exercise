import { z } from 'zod'

export const createSummarySchema = z.object({
  articleId: z.string().min(1, 'Article ID is required'),
  articleTitle: z.string().min(1, 'Article title is required'),
  articleContent: z.string().min(1, 'Article content is required'),
  userContext: z
    .string()
    .min(1, 'User context is required')
    .max(500, 'Context must be less than 500 characters'),
})

export const updateSummarySchema = z.object({
  id: z.string().min(1, 'Summary ID is required'),
  userContext: z
    .string()
    .min(1, 'User context is required')
    .max(500, 'Context must be less than 500 characters'),
})

export type CreateSummaryForm = z.infer<typeof createSummarySchema>
export type UpdateSummaryForm = z.infer<typeof updateSummarySchema>
