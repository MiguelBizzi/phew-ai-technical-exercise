import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { logout } from '@/server/actions/auth-actions'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Suspense } from 'react'
import { ArticleDataLoader } from '@/components/articles/article-data-loader'
import { ArticlesSection } from '@/components/articles/articles-section'
import { SummariesSection } from '@/components/summaries/summaries-section'
import { SummaryDataLoader } from '@/components/summaries/summary-data-loader'

export default async function HomePage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect('/auth')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">News Article Summarizer</h1>
              <p className="text-gray-600">Welcome back, {data.user.email}!</p>
            </div>
            <form action={logout}>
              <Button type="submit" variant="outline">
                Sign Out
              </Button>
            </form>
          </div>
        </div>

        <Tabs defaultValue="articles" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="summaries">My Summaries</TabsTrigger>
          </TabsList>

          <TabsContent value="articles" className="mt-6">
            <Suspense fallback={<ArticleDataLoader />}>
              <ArticlesSection />
            </Suspense>
          </TabsContent>

          <TabsContent value="summaries" className="mt-6">
            <Suspense fallback={<SummaryDataLoader />}>
              <SummariesSection />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
