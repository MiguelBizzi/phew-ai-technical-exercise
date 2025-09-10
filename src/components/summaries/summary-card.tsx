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
import { Loader2, Edit, Trash2, Save, X } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import { deleteSummaryAction } from '@/server/actions/summaries/actions'
import type { ArticleSummary } from '@/types/articles'

interface SummaryCardProps {
  summary: ArticleSummary
}

export function SummaryCard({ summary }: SummaryCardProps) {
  const [userContext, setUserContext] = useState(summary.user_context)

  const { execute: deleteSummary, status: deleteStatus } = useAction(
    deleteSummaryAction,
    {
      onSuccess: () => {
        // The parent component will handle refreshing the list
      },
    },
  )

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this summary?')) {
      deleteSummary({ id: summary.id })
    }
  }

  const isDeleting = deleteStatus === 'executing'

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">
              Article Summary of {summary.article_title}
            </CardTitle>
            <CardDescription>
              Created {new Date(summary.created_at).toLocaleDateString()}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Your Context:</Label>
          <p className="mt-1 text-sm text-gray-600">{summary.user_context}</p>
        </div>

        <div>
          <Label className="text-sm font-medium">AI Summary:</Label>
          <p className="mt-1 rounded-md bg-gray-50 p-3 text-sm text-gray-700">
            {summary.summary}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
