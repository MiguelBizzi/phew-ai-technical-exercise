import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { SummaryCard } from '@/components/summaries/summary-card'
import { fetchSummaries } from '@/server/actions/summaries/fetchs'
import { SummarySectionError } from './summary-section-error'

export async function SummariesSection() {
  try {
    const summaries = await fetchSummaries()

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

        <div className="grid gap-4">
          {summaries.length > 0 ? (
            summaries.map((summary) => (
              <SummaryCard key={summary.id} summary={summary} />
            ))
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-500">
                  No summaries yet. Create your first summary from the Articles
                  tab!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    )
  } catch (error) {
    return <SummarySectionError error={error as Error} />
  }
}
