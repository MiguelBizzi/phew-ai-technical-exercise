import { createClient } from '@/lib/supabase/server'
import type { ArticleSummary } from '@/types/articles'

export async function fetchSummaries(): Promise<ArticleSummary[]> {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  const { data: summaries, error } = await supabase
    .from('article_summaries')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch summaries: ${error.message}`)
  }

  return summaries || []
}
