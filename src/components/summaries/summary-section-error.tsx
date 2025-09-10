import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export function SummarySectionError({ error }: { error: Error }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Summaries</CardTitle>
          <CardDescription>
            View, edit, or delete your generated summaries
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle>Failed to load summaries</CardTitle>
          <CardDescription>
            {error.message || 'An error occurred while loading the summaries.'}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
