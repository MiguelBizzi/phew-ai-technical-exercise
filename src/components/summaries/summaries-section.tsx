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
import { ArrowRight, FileText } from 'lucide-react'

export async function SummariesSection() {
  try {
    const summaries = await fetchSummaries()

    return (
      <div className="space-y-6">
        <Card className="from-card to-card/80 border-0 bg-gradient-to-br shadow-xl backdrop-blur-sm">
          <CardHeader className="flex flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="space-y-2">
              <CardTitle className="text-primary text-xl font-bold sm:text-2xl">
                Your Summaries
              </CardTitle>
              <CardDescription className="text-muted-foreground/80 text-base sm:text-lg">
                View or delete your generated summaries
              </CardDescription>
            </div>

            <Link href="/" className="self-start sm:self-auto">
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
            <Card className="from-card to-card/50 border-0 bg-gradient-to-br shadow-lg backdrop-blur-sm">
              <CardContent className="p-8 text-center sm:p-12">
                <div className="space-y-4">
                  <div className="bg-muted/50 mx-auto flex h-12 w-12 items-center justify-center rounded-full sm:h-16 sm:w-16">
                    <FileText className="text-muted-foreground h-6 w-6 sm:h-8 sm:w-8" />
                  </div>
                  <p className="text-muted-foreground text-base font-medium sm:text-lg">
                    No summaries yet
                  </p>
                  <p className="text-muted-foreground/70 text-sm">
                    Create your first summary from the Articles tab!
                  </p>
                </div>
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
