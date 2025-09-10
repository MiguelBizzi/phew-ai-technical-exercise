'use server'

import { actionClient } from '@/lib/safe-action'
import { createSummarySchema, updateSummarySchema } from '@/types/sumarry-forms'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { phewApi } from '@/lib/api'

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

      // Call n8n workflow to generate summary
      const n8nResponse = await phewApi('/generate-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articleId: parsedInput.articleId,
          userContext: parsedInput.userContext,
        }),
      })

      if (!n8nResponse.ok) {
        throw new Error(`Failed to generate summary: ${n8nResponse.statusText}`)
      }

      const { summary } = await n8nResponse.json()

      // Save to Supabase
      const { data: newSummary, error } = await supabase
        .from('article_summaries')
        .insert({
          article_id: parsedInput.articleId,
          user_context: parsedInput.userContext,
          summary,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to save summary: ${error.message}`)
      }

      revalidatePath('/')
      return {
        success: true,
        data: newSummary,
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

export const updateSummaryAction = actionClient
  .inputSchema(updateSummarySchema)
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

      // Call n8n workflow to regenerate summary
      const n8nResponse = await phewApi('/generate-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articleId: parsedInput.id,
          userContext: parsedInput.userContext,
        }),
      })

      if (!n8nResponse.ok) {
        throw new Error(`Failed to generate summary: ${n8nResponse.statusText}`)
      }

      const { summary } = await n8nResponse.json()

      // Update in Supabase
      const { data: updatedSummary, error } = await supabase
        .from('article_summaries')
        .update({
          user_context: parsedInput.userContext,
          summary,
          updated_at: new Date().toISOString(),
        })
        .eq('id', parsedInput.id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to update summary: ${error.message}`)
      }

      revalidatePath('/')
      return {
        success: true,
        data: updatedSummary,
      }
    } catch (error) {
      console.error('Error updating summary:', error)
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'An error occurred while updating the summary',
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

      // Delete from Supabase
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
