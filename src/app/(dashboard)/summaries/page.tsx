'use server'

import { SummariesSection } from '@/components/summaries/summaries-section'
import { SummaryDataLoader } from '@/components/summaries/summary-data-loader'
import { Suspense } from 'react'

export default async function SummariesPage() {
  return (
    <Suspense fallback={<SummaryDataLoader />}>
      <SummariesSection />
    </Suspense>
  )
}
