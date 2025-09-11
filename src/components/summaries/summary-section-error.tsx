import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'

export function SummarySectionError({ error }: { error: Error }) {
  return (
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
  )
}
