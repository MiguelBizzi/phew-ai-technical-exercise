import { z } from 'zod'

export const ArticleSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  author: z.string().optional(),
  publishedAt: z.string().optional(),
  url: z.string().optional(),
  likesCount: z.number().default(0),
  isLikedByUser: z.boolean().default(false),
})

export const ArticleSummarySchema = z.object({
  id: z.string(),
  article_id: z.string(),
  article_title: z.string(),
  user_context: z.string(),
  summary: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  user_id: z.string(),
})

export type Article = z.infer<typeof ArticleSchema>
export type ArticleSummary = z.infer<typeof ArticleSummarySchema>
