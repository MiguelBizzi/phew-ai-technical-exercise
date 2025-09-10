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

  return data || []
}
