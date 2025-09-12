import { z } from 'zod'

export const ArticleSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  thumbnail_url: z.string(),
  url: z.string(),
  datetime: z.string(),
  likesCount: z.number().default(0),
  isLikedByUser: z.boolean().default(false),
  aiScore: z.number().min(0).max(10).default(0),
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
