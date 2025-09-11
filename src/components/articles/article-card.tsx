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
    <Card className="group from-card to-card/50 w-full border-0 bg-gradient-to-br shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-primary group-hover:text-primary/90 text-xl font-bold transition-colors duration-200">
          {article.title}
        </CardTitle>
        {article.author && (
          <CardDescription className="text-muted-foreground/80 text-base font-medium">
            By {article.author}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-foreground/70 line-clamp-3 text-base leading-relaxed">
          {article.content}
        </div>

        <div className="flex gap-3">
          <ArticleViewDialog article={article} />

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="group/btn hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 hover:shadow-md"
          >
            {isExpanded ? 'Cancel' : 'Add Context & Summarize'}
            {isExpanded ? (
              <XCircle className="h-4 w-4 transition-transform duration-200 group-hover/btn:rotate-90" />
            ) : (
              <BookOpen className="h-4 w-4 transition-transform duration-200 group-hover/btn:scale-110" />
            )}
          </Button>
        </div>

        {isExpanded && (
          <div className="border-border/50 animate-in slide-in-from-top-2 space-y-6 border-t pt-6 duration-300">
            <div className="space-y-3">
              <Label
                htmlFor={`context-${article.id}`}
                className="text-primary text-base font-semibold"
              >
                Add your context (max 500 characters)
              </Label>
              <Textarea
                id={`context-${article.id}`}
                className="border-border/50 bg-secondary/30 focus:bg-secondary/50 min-h-[120px] resize-none rounded-xl transition-colors duration-200"
                placeholder="Add your thoughts, questions, or specific focus areas..."
                value={userContext}
                onChange={(e) => setUserContext(e.target.value)}
                maxLength={500}
                rows={4}
              />
              <div className="text-muted-foreground/70 flex justify-between text-sm">
                <span>Share your insights to get a personalized summary</span>
                <span className="font-medium">{userContext.length}/500</span>
              </div>
            </div>

            <Button
              onClick={handleCreateSummary}
              disabled={!userContext.trim() || isCreating}
              size="lg"
              className="from-coral to-coral/90 hover:from-coral/90 hover:to-coral w-full bg-gradient-to-r shadow-lg transition-all duration-200 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isCreating ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Plus className="h-5 w-5" />
              )}
              {isCreating ? 'Generating Summary...' : 'Generate Summary'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
