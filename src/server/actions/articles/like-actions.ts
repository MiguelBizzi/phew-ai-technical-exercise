'use server'

import { actionClient } from '@/lib/safe-action'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const toggleArticleLikeSchema = z.object({
  articleId: z.string().min(1, 'Article ID is required'),
})

export const toggleArticleLikeAction = actionClient
  .inputSchema(toggleArticleLikeSchema)
  .action(async ({ parsedInput }) => {
    try {
      const supabase = await createClient()

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        return {
          success: false,
          error: 'Unauthorized',
        }
      }

      const { data: existingLike } = await supabase
        .from('article_likes')
        .select('id')
        .eq('article_id', parsedInput.articleId)
        .eq('user_id', user.id)
        .single()

      if (existingLike) {
        const { error } = await supabase
          .from('article_likes')
          .delete()
          .eq('article_id', parsedInput.articleId)
          .eq('user_id', user.id)

        if (error) {
          throw new Error(`Failed to unlike article: ${error.message}`)
        }
      } else {
        const { error } = await supabase.from('article_likes').insert({
          article_id: parsedInput.articleId,
          user_id: user.id,
        })

        if (error) {
          throw new Error(`Failed to like article: ${error.message}`)
        }
      }

      return {
        success: true,
      }
    } catch (error) {
      console.error('Error toggling article like:', error)
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'An error occurred while updating the like',
      }
    }
  })
