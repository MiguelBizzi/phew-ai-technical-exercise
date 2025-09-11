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
import { BookOpen, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export async function ArticlesSection() {
  try {
    const articles = await fetchArticles()

    return (
      <div className="space-y-8">
        <Card className="from-card to-card/80 border-0 bg-gradient-to-br shadow-xl backdrop-blur-sm">
          <CardHeader className="flex items-center justify-between">
            <div className="space-y-2">
              <CardTitle className="text-primary text-2xl font-bold">
                Available Articles
              </CardTitle>
              <CardDescription className="text-muted-foreground/80 text-lg">
                Select an article and add your context to generate an AI summary
                tailored to your needs
              </CardDescription>
            </div>

            <Link href="/summaries">
              <Button size="sm">
                See summaries
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
        </Card>

        <div className="grid gap-6">
          {articles.length > 0 ? (
            articles.map((article, index) => (
              <div
                key={article.id}
                className="animate-in fade-in-0 slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ArticleCard article={article} />
              </div>
            ))
          ) : (
            <Card className="from-card to-card/50 border-0 bg-gradient-to-br shadow-lg backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <div className="space-y-4">
                  <div className="bg-muted/50 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
                    <BookOpen className="text-muted-foreground h-8 w-8" />
                  </div>
                  <p className="text-muted-foreground text-lg font-medium">
                    No articles available at the moment
                  </p>
                  <p className="text-muted-foreground/70 text-sm">
                    Check back later for new content
                  </p>
                </div>
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
