import { NewsPageLoading } from '@/components/news-page-loading'

export default function Loading() {
  return (
    <div className="bg-background min-h-screen p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">News Article Summarizer</h1>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        </div>

        <NewsPageLoading />
      </div>
    </div>
  )
}
