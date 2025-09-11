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
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export async function SummariesSection() {
  try {
    const summaries = await fetchSummaries()

    return (
      <div className="space-y-6">
        <Card className="from-card to-card/80 border-0 bg-gradient-to-br shadow-xl backdrop-blur-sm">
          <CardHeader className="flex items-center justify-between">
            <div className="space-y-2">
              <CardTitle className="text-primary text-2xl font-bold">
                Your Summaries
              </CardTitle>
              <CardDescription className="text-muted-foreground/80 text-lg">
                View or delete your generated summaries
              </CardDescription>
            </div>

            <Link href="/">
              <Button size="sm">
                See articles
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
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
