import { createClient } from '@/lib/supabase/server'
import { phewApi } from '@/lib/api'
import { Article } from '@/types/articles'

export async function fetchArticles(): Promise<Article[]> {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  const response = await phewApi('/articles', {
    method: 'GET',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch articles')
  }

  const data = await response.json()
  const articles = data || []

  const articlesWithLikesAndScores = await Promise.all(
    articles.map(async (article: any) => {
      const { count: likesCount } = await supabase
        .from('article_likes')
        .select('*', { count: 'exact', head: true })
        .eq('article_id', article.id)

      const { data: userLike } = await supabase
        .from('article_likes')
        .select('id')
        .eq('article_id', article.id)
        .eq('user_id', user.id)
        .single()

      const { data: aiScoreData } = await supabase
        .from('article_scores')
        .select('score')
        .eq('article_id', article.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      return {
        ...article,
        likesCount: likesCount || 0,
        isLikedByUser: !!userLike,
        aiScore: aiScoreData?.score || 0,
      }
    }),
  )

  return sortArticlesByEngagement(articlesWithLikesAndScores)
}

export function sortArticlesByEngagement(articles: Article[]): Article[] {
  return articles.sort((a, b) => {
    // Calculate engagement score based on AI score, likes, and recency
    const now = new Date()
    const aPublishedAt = a.publishedAt ? new Date(a.publishedAt) : now
    const bPublishedAt = b.publishedAt ? new Date(b.publishedAt) : now

    // Time decay factor (newer articles get higher score)
    const aTimeDecay = Math.max(
      0,
      1 - (now.getTime() - aPublishedAt.getTime()) / (30 * 24 * 60 * 60 * 1000),
    ) // 30 days
    const bTimeDecay = Math.max(
      0,
      1 - (now.getTime() - bPublishedAt.getTime()) / (30 * 24 * 60 * 60 * 1000),
    ) // 30 days

    // AI Score is the most important factor (weight: 5x)
    // Likes count (weight: 1x)
    // Time decay bonus (weight: 2x)
    const aScore = a.aiScore * 5 + a.likesCount + aTimeDecay * 2
    const bScore = b.aiScore * 5 + b.likesCount + bTimeDecay * 2

    // Sort by engagement score (descending)
    return bScore - aScore
  })
}
