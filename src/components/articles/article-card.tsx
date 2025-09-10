'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { BookOpen, Loader2, Plus, XCircle } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import { createSummaryAction } from '@/server/actions/summaries/actions'
import type { Article } from '@/types/articles'
import ArticleViewDialog from './article-view-dialog'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface ArticleCardProps {
  article: Article
}

export function ArticleCard({ article }: ArticleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [userContext, setUserContext] = useState('')
  const router = useRouter()

  const { execute: createSummary, status: createStatus } = useAction(
    createSummaryAction,
    {
      onSuccess: () => {
        setUserContext('')
        toast.success('Summary created successfully')
        router.push('/summaries')
      },
    },
  )

  const handleCreateSummary = () => {
    if (!userContext.trim()) return
    createSummary({
      articleId: article.id,
      articleTitle: article.title,
      articleContent: article.content,
      userContext: userContext.trim(),
    })
  }

  const isCreating = createStatus === 'executing'

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">{article.title}</CardTitle>
        {article.author && (
          <CardDescription>By {article.author}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="line-clamp-3 text-sm text-gray-600">
          {article.content}
        </div>

        <div className="flex gap-2">
          <ArticleViewDialog article={article} />

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Cancel' : 'Add Context & Summarize'}
            {isExpanded ? (
              <XCircle className="h-4 w-4" />
            ) : (
              <BookOpen className="h-4 w-4" />
            )}
          </Button>
        </div>

        {isExpanded && (
          <div className="space-y-3 border-t pt-4">
            <div>
              <Label htmlFor={`context-${article.id}`}>
                Add your context (max 500 characters)
              </Label>
              <Textarea
                id={`context-${article.id}`}
                className="mt-2"
                placeholder="Add your thoughts, questions, or specific focus areas..."
                value={userContext}
                onChange={(e) => setUserContext(e.target.value)}
                maxLength={500}
                rows={3}
              />
              <div className="mt-1 text-xs text-gray-500">
                {userContext.length}/500 characters
              </div>
            </div>

            <Button
              onClick={handleCreateSummary}
              disabled={!userContext.trim() || isCreating}
              size="sm"
            >
              {isCreating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Generate Summary
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
