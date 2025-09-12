'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  BookOpen,
  Loader2,
  Plus,
  XCircle,
  Heart,
  HeartIcon,
  Star,
  Calendar,
  ExternalLink,
} from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import { createSummaryAction } from '@/server/actions/summaries/actions'
import { toggleArticleLikeAction } from '@/server/actions/articles/like-actions'
import type { Article } from '@/types/articles'
import ArticleViewDialog from './article-view-dialog'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { formatDate } from '@/utils/format-date'

interface ArticleCardProps {
  article: Article
}

export function ArticleCard({ article }: ArticleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [userContext, setUserContext] = useState('')
  const [localLikesCount, setLocalLikesCount] = useState(article.likesCount)
  const [localIsLiked, setLocalIsLiked] = useState(article.isLikedByUser)
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

  const { execute: toggleLike, status: likeStatus } = useAction(
    toggleArticleLikeAction,
    {
      onSuccess: (data) => {
        if (!data?.data.success) {
          setLocalLikesCount(article.likesCount)
          setLocalIsLiked(article.isLikedByUser)
          toast.error(data?.data.error || 'Failed to update like')
        }
      },
      onError: (error) => {
        setLocalLikesCount(article.likesCount)
        setLocalIsLiked(article.isLikedByUser)
        toast.error(error.error?.serverError || 'Failed to update like')
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

  const handleToggleLike = () => {
    const newIsLiked = !localIsLiked
    const newLikesCount = newIsLiked ? localLikesCount + 1 : localLikesCount - 1

    setLocalIsLiked(newIsLiked)
    setLocalLikesCount(newLikesCount)

    toggleLike({ articleId: article.id })
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-500'
    if (score >= 6) return 'text-yellow-500'
    if (score >= 4) return 'text-orange-500'
    return 'text-red-500'
  }

  const isCreating = createStatus === 'executing'
  const isLiking = likeStatus === 'executing'
  const publishedDate = formatDate(article.datetime)

  return (
    <Card className="group from-card to-card/50 w-full overflow-hidden border-0 bg-gradient-to-br shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <CardHeader className="pb-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-primary group-hover:text-primary/90 line-clamp-2 pr-2 text-lg font-bold transition-colors duration-200 sm:text-xl">
              {article.title}
            </CardTitle>
            <div className="text-muted-foreground/70 mt-1 flex items-center gap-1 text-sm">
              <Calendar className="h-3 w-3" />
              <span>{publishedDate}</span>
            </div>
          </div>

          {article.aiScore > 0 && (
            <div
              className={`flex flex-shrink-0 items-center gap-1 ${getScoreColor(article.aiScore)}`}
            >
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm font-bold">
                {article.aiScore.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 sm:space-y-6">
        <div className="hidden sm:block">
          <div className="text-foreground/70 line-clamp-5 sm:line-clamp-3">
            {article.content}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
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

          <div className="flex items-center justify-between gap-2 sm:justify-end">
            {article.url && (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span className="text-xs">Source</span>
                </a>
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleLike}
              disabled={isLiking}
              className={`group/like flex items-center gap-2 transition-all duration-200 hover:scale-105 ${
                localIsLiked
                  ? 'text-red-500 hover:text-red-600'
                  : 'text-muted-foreground hover:text-red-500'
              }`}
            >
              {isLiking ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : localIsLiked ? (
                <Heart className="h-4 w-4 fill-current" />
              ) : (
                <HeartIcon className="h-4 w-4" />
              )}
              <span className="text-sm font-medium">
                {localLikesCount} {localLikesCount === 1 ? 'like' : 'likes'}
              </span>
            </Button>
          </div>
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
