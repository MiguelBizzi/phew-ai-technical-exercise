'use server'

import { Suspense } from 'react'
import { ArticleDataLoader } from '@/components/articles/article-data-loader'
import { ArticlesSection } from '@/components/articles/articles-section'

export default async function ArticlesPage() {
  return (
    <Suspense fallback={<ArticleDataLoader />}>
      <ArticlesSection />
    </Suspense>
  )
}
