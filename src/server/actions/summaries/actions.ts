'use server'

import { actionClient } from '@/lib/safe-action'
import { createSummarySchema, updateSummarySchema } from '@/types/sumarry-forms'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { n8nApi } from '@/lib/api'

export const createSummaryAction = actionClient
  .inputSchema(createSummarySchema)
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

      const n8nResponse = await n8nApi('/summaries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articleId: parsedInput.articleId,
          articleTitle: parsedInput.articleTitle,
          articleContent: parsedInput.articleContent,
          userId: user.id,
          userContext: parsedInput.userContext,
        }),
      })

      if (!n8nResponse.ok) {
        throw new Error(`Failed to generate summary: ${n8nResponse.statusText}`)
      }

      revalidatePath('/')
      return {
        success: true,
      }
    } catch (error) {
      console.error('Error creating summary:', error)
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'An error occurred while creating the summary',
      }
    }
  })

export const deleteSummaryAction = actionClient
  .inputSchema(updateSummarySchema.pick({ id: true }))
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

      const { error } = await supabase
        .from('article_summaries')
        .delete()
        .eq('id', parsedInput.id)
        .eq('user_id', user.id)

      if (error) {
        throw new Error(`Failed to delete summary: ${error.message}`)
      }

      revalidatePath('/')
      return {
        success: true,
      }
    } catch (error) {
      console.error('Error deleting summary:', error)
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'An error occurred while deleting the summary',
      }
    }
  })
