import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ArticleCard } from '@/components/articles/article-card'
import { fetchArticles } from '@/server/actions/articles/fetchs'
import { ArticleSectionError } from './article-section-error'

export async function ArticlesSection() {
  try {
    const articles = await fetchArticles()

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Available Articles</CardTitle>
            <CardDescription>
              Select an article and add your context to generate an AI summary
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid gap-4">
          {articles.length > 0 ? (
            articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-500">
                  No articles available at the moment.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    )
  } catch (error) {
    return <ArticleSectionError error={error as Error} />
  }
}
